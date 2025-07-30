<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RequestsController;
use App\Http\Controllers\UserController;
use Inertia\Inertia;

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Dashboard');
    })->name('home');

    Route::get('/request', [RequestsController::class, 'getAllRequests'])->name('requests');


    // Route::get('/request/withdrawal', function () {
    //     return Inertia::render('RequestWithdrawal');
    // })->name('request.withdrawal');

    // Route::get('/request/return', function () {
    //     return Inertia::render('RequestReturn');
    // })->name('request.return');

    // Route::get('/request/disposal', function () {
    //     return Inertia::render('RequestDisposal');
    // })->name('request.disposal');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');

    Route::get('/profile', function () {
        return Inertia::render('Profile');
    })->name('profile');

    Route::get('/reports', function () {
        return Inertia::render('Reports');
    })->name('reports');

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
});
