<?php

use App\Http\Controllers\ClassesController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Dashboard2Controller;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\LevelsController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;


Route::get('/', [Controller::class, 'LandingPage']);

Route::get('/home', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('home');
Route::get('/home/{id}', [Dashboard2Controller::class, 'index'])->middleware(['auth', 'verified']);

// Route::get('/table', [ClassesController::class, 'index'])->middleware(['auth', 'verified'])->name('table'); sudah ada di Route::resource('classes', ClassesController::class);


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'admins'])->group(function () {
    // Route::get('/your-controller-route', [YourController::class, 'yourMethod']);
    Route::resource('users', UsersController::class);

    // Route:: Add other routes th    at     require admin access here
});

require __DIR__.'/auth.php';

// Route::get('/editor', [EditorController::class, 'index']);
Route::get('/editor/{class_id}', [LevelsController::class, 'create'])->name('editor');

Route::resource('classes', ClassesController::class);
Route::resource('levels', LevelsController::class);
Route::get('data/users/login', [Controller::class, 'dataUserLogin']);
