<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Passport\Passport;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Load Passport routes explicitly
        if (!app()->routesAreCached()) {
            require base_path('routes/passport.php');
        }
        // Set access token expiry to 15 minutes
        Passport::tokensExpireIn(now()->addMinutes(15));
        
        // Set refresh token expiry (optional)
        Passport::refreshTokensExpireIn(now()->addDays(1));
    }
}
