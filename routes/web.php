<?php

// use Illuminate\Foundation\Application;

use App\Http\Controllers\UserController;
use App\Http\Controllers\UpdateUserProfileController;
use App\Http\Controllers\RequestsController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\RDSController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Http\Controllers\RegisteredUserController;


Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
    'twofactor',
    'force-register', // Ensure users are forced to register if no users exist
])->group(function () {
    require base_path('routes/sidenav.php');

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
    Route::post('/request/upload-pdf', [RequestsController::class, 'uploadPdf']);
    Route::get('/requests/generate-box-code/{office}', [RequestsController::class, 'generateBoxCode']);

    Route::middleware(['role:super-admin|regional-document-custodian'])->group(function () {
        Route::get('/manage-requests', [RequestsController::class, 'manageRequests'])->name('requests.manage');
        Route::post('/manage-requests', [RequestsController::class, 'updateStatus'])->name('requests.update-status');
    });

    Route::middleware(['role:super-admin'])->group(function () {
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
        Route::post('/users/create', [UserController::class, 'store'])->name('users.store');
        Route::post('/users/{user}/edit', [UserController::class, 'update'])->name('users.update');
    });
});

Route::get('/two-factor/prompt', function () {
    return Inertia::render('Auth/TwoFactorPrompt');
})->middleware(['auth', '2fa.prompt'])->name('two-factor.prompt');


Route::middleware(['guest', 'restrict-register'])->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])
        ->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});
