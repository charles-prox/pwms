<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RequestsController;
use Inertia\Inertia;

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Dashboard');
    })->name('home');

    Route::get('/request-storage', function () {
        return Inertia::render('RequestStorage');
    })->name('request.storage');

    Route::get('/request-withdrawal', function () {
        return Inertia::render('RequestWithdrawal');
    })->name('request.withdrawal');

    Route::get('/request-return', function () {
        return Inertia::render('RequestReturn');
    })->name('request.return');

    Route::get('/request-disposal', function () {
        return Inertia::render('RequestDisposal');
    })->name('request.disposal');

    Route::get('/users', function () {
        return Inertia::render('Users');
    })->name('users');

    Route::get('/profile', function () {
        return Inertia::render('Profile');
    })->name('profile');

    Route::get('/reports', function () {
        return Inertia::render('Reports');
    })->name('reports');

    Route::get('/users', function () {
        return Inertia::render('Users');
    })->name('users');

    Route::get('/offices', function () {
        return Inertia::render('Offices');
    })->name('offices');

    Route::get('/rds', function () {
        return Inertia::render('Rds');
    })->name('rds');

    Route::get('/locations', function () {
        return Inertia::render('Locations');
    })->name('location');

    Route::get('/storage-record-entry', function () {
        return Inertia::render('StorageRecordEntry');
    })->name('storage.record.entry');


    // If you have nested routes or dynamic routes, you can add them as well
    Route::get('/request-storage/{form_no}', [RequestsController::class, 'getFormDetails'])
        ->name('request.storage.details');
});
