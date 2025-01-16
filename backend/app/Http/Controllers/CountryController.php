<?php

namespace App\Http\Controllers;
\Log::info(memory_get_usage());
ini_set('memory_limit', '1G');
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

use App\Models\User;
use App\Models\Members;
use App\Models\FavouriteCountry;

class CountryController extends Controller
{
    // Get favorite country details by member_id
    public function favouriteCountryByMemberId($memberId)
    {
        $countries = FavouriteCountry::where('member_id', $memberId)->get();
        return response()->json($countries);
    }

    // Insert a new favorite country
    public function storeFavouriteCountry(Request $request)
    {
        // Validation Rules
        $validator = Validator::make($request->all(), [
            'countries' => 'required|array',
            'countries.*.code' => 'required|string|max:100',
            'countries.*.favourite_country' => 'required|in:0,1',
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










        $request->validate([
            'favourite_country_id' => 'required|numeric',
            'code' => 'required|string',
            'favourite_country' => 'required|numeric',
        ]);

        $country = FavouriteCountry::create($request->all());

        return response()->json(['success' => true, 'data' => $country, 'message' => 'Country added successfully']);
    }

    // Update a favorite country
    public function update(Request $request, $id)
    {
        $request->validate([
            'member_id' => 'required|numeric',
            'code' => 'required|string|max:100',
            'favourite_country' => 'required|string|max:200',
        ]);

        $country = FavouriteCountry::findOrFail($id);
        $country->update($request->all());

        return response()->json(['success' => true, 'data' => $country, 'message' => 'Country updated successfully']);
    }

    // Delete a favorite country
    public function delete($id)
    {
        $country = FavouriteCountry::findOrFail($id);
        $country->delete();

        return response()->json(['success' => true, 'message' => 'Country deleted successfully']);
    }
}
