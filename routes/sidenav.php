<?php

use Illuminate\Support\Facades\Route;
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

    // Add any other routes that you need
    Route::get('/profile', function () {
        return Inertia::render('Profile');
    })->name('profile');

    // If you have nested routes or dynamic routes, you can add them as well
    Route::get('/request-storage/{id}', function ($id) {
        return Inertia::render('RequestStorageDetails', ['id' => $id]);
    })->name('request.storage.details');
});
