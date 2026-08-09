<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('auth.login', function (Request $request) {
            $email = Str::lower((string) $request->input('email'));

            return Limit::perMinute(5)->by($email.'|'.$request->ip());
        });

        RateLimiter::for('auth.register', fn (Request $request) =>
            Limit::perMinute(3)->by($request->ip())
        );

        RateLimiter::for('auth.password', fn (Request $request) =>
            Limit::perMinute(5)->by(($request->user()?->getAuthIdentifier() ?? 'guest').'|'.$request->ip())
        );
    }
}
