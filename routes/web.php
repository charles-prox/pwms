<?php

// use Illuminate\Foundation\Application;

use App\Http\Controllers\LoginController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\UpdateUserProfileController;
use App\Http\Controllers\RegisterAdminController;
use App\Http\Controllers\RequestsController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\RDSController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require base_path('routes/sidenav.php');

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {

    Route::prefix('account')->name('account.')->group(function () {
        Route::get('security', [UserProfileController::class, 'show'])->name('security');
        Route::get('profile', function () {
            return Inertia::render('Account/Profile');
        })->name('profile');
        Route::post('profile/update', [UpdateUserProfileController::class, 'update'])->middleware([config('fortify.auth_middleware', 'auth') . ':' . config('fortify.guard')])->name('profile.update');
    });

    Route::post('rds/import', [RDSController::class, 'import'])->name('rds.import');
    Route::get('/rds/get', [RDSController::class, 'index'])->name('rds.index');

    Route::post('/request/create/{type}', [RequestsController::class, 'createBlankRequest'])->name('requests.create');
    Route::get('/request/{form_no}', [RequestsController::class, 'getFormDetails'])->name('request.details');
    Route::post('/request/{form_number}/save-draft', [RequestsController::class, 'saveDraft']);
    Route::post('/request/{form_number}/print', [RequestsController::class, 'submitRequest']);
    Route::delete('/request/{form_number}', [RequestsController::class, 'destroy']);
});


Route::get('/register', [RegisterAdminController::class, 'create'])
    ->middleware(['guest'])
    ->name('register');

Route::get('/login', [LoginController::class, 'create'])
    ->middleware(['guest'])
    ->name('login');

Route::get('/offices', [OfficeController::class, 'index'])
    ->name('offices');
