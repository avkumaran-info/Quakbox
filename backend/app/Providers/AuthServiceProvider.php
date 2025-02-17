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

        // Set the token expiration time (e.g., 60 minutes)
        Passport::tokensExpireIn(now()->addMinutes(60));

        // Optionally, set refresh token expiration time
        Passport::refreshTokensExpireIn(now()->addMinutes(3));
    }
}
