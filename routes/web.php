<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Availability;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', [
    App\Http\Controllers\HomeController::class,
    'index',
])->name('home');

Auth::routes();

Route::get('/home', [
    App\Http\Controllers\HomeController::class,
    'index',
])->name('home');

Auth::routes();

Route::get('/home', [
    App\Http\Controllers\HomeController::class,
    'index',
])->name('home');

Auth::routes();

Route::get('/home', [
    App\Http\Controllers\HomeController::class,
    'index',
])->name('home');

Route::get('/availability', [Availability::class, 'index'])->name('index');

//post a date into database
Route::post('/availability/{date}', [Availability::class, 'store'])->name(
    'availability'
);

//delete a date into database
Route::delete('/availability/{date}', [Availability::class, 'destroy'])->name(
    'delete'
);

// Route::post('/availability/{date}', function ($date) {
//     DB::table('availability')->insert([
//         'date' => $date,
//     ]);

//     return response()->json(['status' => 'success']);
// });

// Route::delete('/availability/{date}', function ($date) {
//     DB::table('availability')
//         ->where('date', $date)
//         ->delete();

//     return response()->json(['status' => 'success']);
// });
