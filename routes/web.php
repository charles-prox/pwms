<?php

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
    'force-register',
])->group(function () {
    require base_path('routes/sidenav.php');

    // Account routes
    Route::prefix('account')->name('account.')->group(function () {
        Route::get('security', [UserProfileController::class, 'show'])->name('security');
        Route::get('profile', fn() => Inertia::render('Account/Profile'))->name('profile');
        Route::post('profile/update', [UpdateUserProfileController::class, 'update'])
            ->middleware([config('fortify.auth_middleware', 'auth') . ':' . config('fortify.guard')])
            ->name('profile.update');
    });

    // RDS routes
    Route::post('/rds/import', [RDSController::class, 'import'])->middleware('permission:rds.import')->name('rds.import');
    Route::get('/rds/search', [RDSController::class, 'search'])->middleware('permission:rds.view')->name('rds.search');
    Route::get('/rds/get', [RDSController::class, 'index'])->middleware('permission:rds.view')->name('rds.index');

    // Request routes
    Route::post('/request/create/{type}', [RequestsController::class, 'createBlankRequest'])
        ->middleware('permission:request.create')
        ->name('requests.create');

    Route::get('/request/{form_no}', [RequestsController::class, 'getFormDetails'])
        ->middleware('permission:request.view')
        ->name('request.details');
    Route::get('/request/{form_no}/print', [RequestsController::class, 'printRequest'])
        ->middleware('permission:request.view')
        ->name('requests.print');

    Route::post('/request/{form_number}/save-draft', [RequestsController::class, 'saveDraft'])
        ->middleware('permission:request.create');

    Route::post('/request/{form_number}/print', [RequestsController::class, 'submitRequest'])
        ->middleware('permission:request.create');

    Route::delete('/request/{form_number}', [RequestsController::class, 'destroy'])
        ->middleware('permission:request.cancel');

    Route::post('/request/upload-pdf', [RequestsController::class, 'uploadPdf'])
        ->middleware('permission:request.view');

    Route::get('/requests/generate-box-code/{office}', [RequestsController::class, 'generateBoxCode'])
        ->middleware('permission:request.generate-box-code');

    // Manage requests (approvals)
    Route::middleware([
        'permission:request.approve.storage|request.approve.withdrawal|request.approve.return|request.approve.disposal'
    ])->group(function () {
        Route::get('/manage-requests', [RequestsController::class, 'manageRequests'])->name('requests.manage');
        Route::post('/manage-requests', [RequestsController::class, 'updateStatus'])->name('requests.update-status');
    });

    // User management
    Route::middleware('permission:user.create')->group(function () {
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users/create', [UserController::class, 'store'])->name('users.store');
    });

    Route::middleware('permission:user.update')->group(function () {
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::post('/users/{user}/edit', [UserController::class, 'update'])->name('users.update');
    });

    Route::get('/users/{id}', [UserController::class, 'show'])
        ->middleware('permission:user.view')
        ->name('users.show');
});

// Two-factor prompt
Route::get('/two-factor/prompt', fn() => Inertia::render('Auth/TwoFactorPrompt'))
    ->middleware(['auth', '2fa.prompt'])
    ->name('two-factor.prompt');

// Guest registration
Route::middleware(['guest', 'restrict-register'])->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});
