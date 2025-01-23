<?php

namespace App\Http\Controllers;
\Log::info(memory_get_usage());
ini_set('memory_limit', '5G');
set_time_limit(500);
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

use App\Models\User;
use App\Models\Members;
use App\Models\FavouriteCountry;
use App\Models\GeoCountry;

use GuzzleHttp\Client;

class CountryController extends Controller
{
    public function getGeoCountry(Request $request) {

        $geoCountryList = GeoCountry::get();

        if ($geoCountryList->isEmpty()) {
            $response = Http::get('https://restcountries.com/v3.1/all?fields=name,flags,cca2');
            if ($response->successful()) {
                $countries = $response->json();

                foreach ($countries as $country) {
                    // Extract relevant fields
                    $countryName = $country['name']['common'] ?? null;
                    $countryCode = $country['cca2'] ?? null;
                    $countryImage = $country['flags']['png'] ?? null;

                    $imageResponse = Http::get($countryImage);
                    if ($imageResponse->successful()) {
                        // Get the image content
                        $imageContent = $imageResponse->body();
                        // Define a file name and path
                        $fileName = $countryCode.'.png';
                        $filePath = 'flags/' . $fileName;
                        // Store the file in the 'public' directory
                        Storage::disk('public')->put($filePath, $imageContent);
                    }
                    if ($countryName && $countryCode) {
                        // Insert or update into the database
                        GeoCountry::updateOrCreate(
                            ['code' => $countryCode],
                            ['country_name' => $countryName,
                             'country_image' => env('APP_URL') . '/api/images/flags/'.$countryCode.'.png'],
                        );
                    }
                }
            }
        }

        $geoCountryList = GeoCountry::orderBy('country_name', 'asc')->get();

        return response()->json([
            'success' => true,
            'geo_countries' => $geoCountryList
        ], 400);
    }

    // Get favorite country details by member_id
    public function favouriteCountryByMemberId(Request $request)
    {
        if (!$request && !$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization error'
            ], 400);
        }
        $countries = FavouriteCountry::where('member_id', $request->user()->id)->get();

        return response()->json([
            'success' => true,
            'favourite_country' => $countries
        ]);
        return response()->json($countries);
    }

    // Insert a new favorite country
    public function storeFavouriteCountry(Request $request)
    {
        // Validation Rules
        $validator = Validator::make($request->all(), [
            'countries' => 'required|array',
            'countries.*.code' => 'required|string|max:100',
            'countries.*.favourite_country' => 'required|in:0,1,2,3',
        ]);

        // If validation fails
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 400);
        }

        // Extracting the countries array from the validated request
        $countries = $request->input('countries');

        // Custom insert query
        try {
            // Insert data using a custom insert query
            foreach ($countries as $country) {
                DB::table('favourite_country')->insert([
                    'member_id' => $request->user()->id,
                    'code' => $country['code'],
                    'favourite_country' => $country['favourite_country'],
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Countries added successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error inserting data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Update a favorite country
    public function updateFavouriteCountry(Request $request)
    {

        // Validation Rules
        $validator = Validator::make($request->all(), [
            'countries' => 'required|array',
            'countries.*.favourite_country_id' => 'required|numeric',
            'countries.*.code' => 'required|string',
            'countries.*.favourite_country' => 'required|in:0,1,2,3',
        ]);

        // If validation fails
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 400);
        }

        // Extracting the countries array from the validated request
        $countries = $request->input('countries');

        // Custom insert query
        try {
            // Insert data using a custom insert query
            foreach ($countries as $country) {
                if ($country['favourite_country'] == "3") {
                    DB::table('favourite_country')
                        ->where('member_id', $request->user()->id)
                        ->where('code', $country['code'])
                        ->delete();
                } else {
                    DB::table('favourite_country')
                        ->where('member_id', $request->user()->id)
                        ->where('code', $country['code'])
                        ->update([
                            'favourite_country' => $country['favourite_country'],
                        ]);    
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Countries updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error inserting data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Delete a favorite country
    public function deleteFavouriteCountry(Request $request)
    {
        $delete = DB::table('favourite_country')
        ->where('member_id', $request->user()->id)
        ->delete();

        return response()->json(['success' => true, 'message' => 'Countries reseted successfully']);
    }
}
