<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    // This method handles the display of the dashboard page
    public function dashboard()
    {
        if (Auth::check()) {
            $userEmail = Auth::user()->email;
            return view('dashboard', compact('userEmail'));
        }
    
        return redirect('/login');  // Or some other fallback if not authenticated
    }
    
}
