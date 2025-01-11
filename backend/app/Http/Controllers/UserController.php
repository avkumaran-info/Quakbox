<?php

namespace App\Http\Controllers;
\Log::info(memory_get_usage());
ini_set('memory_limit', '1G');
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserStoreRequest;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function elogin(Request $request){
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            $token = $user->createToken('API Token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function elogout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function index(){
        $users = User::all();

        return response()->json([
        'results' => $users
        ],200);
    }
    

    public function show($id){

        $users = User::find($id);

        if(!$users){
            return response()->json([
                'message' => 'user not found'
            ],404);
        }

        return response()->json([
            'user' => $users
        ],200);


        
    }

    public function store(UserStoreRequest $request){
        // try {
            User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' =>$request->password
            ]);

            return response()->json([
                'result' => true
            ],200);

        // } catch (\Exception $e) {
        //     return response()->json([
                
        //     ],500);
        // }
    }

    public function update(UserStoreRequest $request,$id){

        try {
            $users = User::find($id);
            if(!$users){
                return $users()->json([
                    'message' => 'User not found!'
                ],404);
            }

            $users->name = $request->name;
            $users->email = $request->email;
            $users->password = $request->password;
            
            $users->save();

            return response()->json([
                'message' => 'User successfully updated'
            ],200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => "Something went wrong!"
            ],500);
        }
    } 
        
    public function delete($id){

        $users = User::find($id);
        if(!$users){
            return $users()->json([
                'message' => 'User not found!'
            ],404);
        }

        $users->delete();

        return response()->json([
            'message' => 'user succesfully deleted'
        ],200);
    }
}
