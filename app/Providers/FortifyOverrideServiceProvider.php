<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TwoFactorController;
use App\Http\Middleware\AdminCheck;

class FortifyOverrideServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Route::middleware(['web', 'auth'])->group(function () {
            // Only for users who don't have 2FA yet
            Route::middleware('2fa.not_enabled')->group(function () {
                Route::post('/two-factor/initiate', [TwoFactorController::class, 'initiate'])->name('two-factor.initiate');
                Route::post('/two-factor/verify', [TwoFactorController::class, 'verify'])->name('two-factor.verify');
            });

            // Only for users who already enabled 2FA
            Route::middleware('2fa.enabled')->group(function () {
                Route::delete('/two-factor', [TwoFactorController::class, 'destroy'])->name('two-factor.disable');
                Route::get('/two-factor/qr', [TwoFactorController::class, 'showQrCode'])->name('two-factor.qr');
                Route::get('/two-factor/recovery-codes', [TwoFactorController::class, 'showRecoveryCodes'])->name('two-factor.codes');
            });
        });

        Route::middleware(['web', AdminCheck::class])->group(function () {
            Route::post('/login', [\Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::class, 'store']);
            Route::get('/register', [\Laravel\Fortify\Http\Controllers\RegisteredUserController::class, 'create']);
            // Route::post('/register', [\Laravel\Fortify\Http\Controllers\RegisteredUserController::class, 'store']);
        });
        // Route::middleware(['web', AdminCheck::class])->group(function () {
        //     Route::get('/login', fn() => null)->name('login');      // Don't define the view — just register the route for middleware
        //     Route::get('/register', fn() => null)->name('register');
        // });
    }
}
