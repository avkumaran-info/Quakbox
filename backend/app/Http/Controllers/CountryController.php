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
use App\Models\Flag_Likes;
use App\Models\Flag_Comments;
use App\Models\Flag_Shares;

use GuzzleHttp\Client;

class CountryController extends Controller
{
    public function getGeoCountry(Request $request, $cc = null) {

        $geoCountryList = GeoCountry::get();

        if ($geoCountryList->isEmpty()) {
            $response = Http::get('https://restcountries.com/v3.1/all?fields=name,flags,cca2,idd');
            if ($response->successful()) {
                $countries = $response->json();

                foreach ($countries as $country) {
                    // Extract relevant fields
                    $countryName = $country['name']['common'] ?? null;
                    $countryCode = $country['cca2'] ?? null;
                    $countryPhoneCode = $country['idd'] ?? null;
                    $countrySuffix = (isset($countryPhoneCode["suffixes"][0]) ? $countryPhoneCode["suffixes"][0] : "");
                    $countryImage = $country['flags']['png'] ?? null;
                    $imageResponse = Http::get($countryImage);
                    if ($imageResponse->successful()) {
                        // Get the image content
                        $imageContent = $imageResponse->body();
                        $dialingCode = $countryPhoneCode["root"].$countrySuffix;
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
                             'phone_code' => $dialingCode,
                             'country_image' => env('APP_URL') . '/api/images/flags/'.$countryCode.'.png'],
                        );
                    }
                }
            }
        }

        $geoCountryList = GeoCountry::orderBy('country_name', 'asc')
                            ->when($cc, function ($query, $country_code) {
                                return $query->where('code', $country_code);
                            })->get();
        $geoCountrySuperList = [];
        $geoCountryDetail;
        foreach ($geoCountryList as $country) {
            $geoCountryDetail["country_id"]     = $country["country_id"];
            $geoCountryDetail["country_name"]   = $country["country_name"];
            $geoCountryDetail["code"]           = $country["code"];
            $geoCountryDetail["phone_code"]     = $country["phone_code"];
            $geoCountryDetail["country_image"]  = $country["country_image"];
            $countryActivity = GeoCountry::getCountryActivity($country["code"]);
            if ($countryActivity) {
                $geoCountryDetail["like_cnt"] = $countryActivity->likes_count;
                $geoCountryDetail["dislikes_count"] = $countryActivity->dislikes_count;
                $geoCountryDetail["comments_count"] = $countryActivity->comments_count;
                $geoCountryDetail["shares_count"] = $countryActivity->shares_count;
            } else {
                $geoCountryDetail["like_cnt"] = 0;
                $geoCountryDetail["dislikes_count"] = 0;
                $geoCountryDetail["comments_count"] = 0;
                $geoCountryDetail["shares_count"] = 0;
            }
            $geoCountrySuperList[] = $geoCountryDetail;
        }

        return response()->json([
            'success' => true,
            'geo_countries' => $geoCountrySuperList
        ], 200);
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

    public function storeCountryLikes(Request $request)
    {
        try {
            $request->validate([
                'country_code' => 'required',
                'is_like' => 'required|boolean',
            ]);

            Flag_Likes::updateOrCreate(
                ['country_code' => $request->country_code, 'user_id' => $request->user()->id],
                ['is_like' => $request->is_like]
            );
            
            return response()->json(['success' => true, 'message' => 'Country Liked/Disliked successfully']);
        
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error inserting data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function storeCountryComments(Request $request)
    {
        try {
            $request->validate([
                'country_code' => 'required',
                'comment' => 'required|string',
            ]);
            $request["user_id"] = $request->user()->id;
            Flag_Comments::create($request->all());
            
            return response()->json(['success' => true, 'message' => 'Country Commented successfully']);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error inserting data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function storeCountryShares(Request $request)
    {
        try {
            $request->validate([
                'country_code' => 'required',
                'platform' => 'required|string',
            ]);
            $request["user_id"] = $request->user()->id;
            Flag_Shares::create($request->all());
            
            return response()->json(['success' => true, 'message' => 'Country Shared successfully']);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error inserting data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getCountryComments(Request $request, $cc)
    {
        $countryComment = GeoCountry::getCountryComment($cc);

        return $countryComment;

    }
}
