<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\Api\BoxController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/offices', [OfficeController::class, 'index'])
    ->name('offices');

Route::get('/offices/{id}', [OfficeController::class, 'show'])
    ->name('offices.show');

Route::get('/positions', [PositionController::class, 'list'])
    ->name('positions');

Route::get('/boxes/search', [BoxController::class, 'search'])
    ->name('boxes.search');
