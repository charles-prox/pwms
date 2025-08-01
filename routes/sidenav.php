<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RequestsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use Inertia\Inertia;


Route::get('/', [DashboardController::class, 'index'])->name('home');

Route::get('/request', [RequestsController::class, 'getAllRequests'])->name('requests');

Route::get('/profile', function () {
    return Inertia::render('Profile');
})->name('profile');

Route::middleware(['role:super-admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');

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
