<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Availability;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AvailibilityController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//get all dates available for a specific user.
Route::post('/availability', [AvailibilityController::class, 'index'])->name(
    'index'
);

//post a date into database
Route::post('/availability/date', [
    AvailibilityController::class,
    'store',
])->name('availability');

//delete a date from database
Route::post('/availability/delete/date', [
    AvailibilityController::class,
    'destroy',
])->name('delete');
