<?php

use App\Http\Controllers\ClassesController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\LevelsController;
use Illuminate\Support\Facades\Route;


Route::get('/', [Controller::class, 'LandingPage']);

Route::get('/home', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('home');

Route::get('/table', [ClassesController::class, 'index'])->middleware(['auth', 'verified'])->name('table');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// Route::get('/editor', [EditorController::class, 'index']);
Route::get('/editor/{class_id}', [LevelsController::class, 'create'])->name('editor');

Route::resource('classes', ClassesController::class);
Route::resource('levels', LevelsController::class);
