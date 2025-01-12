<?php

use App\Http\Controllers\Api\v1\LevelsController;
use App\Http\Controllers\Api\v1\UserController;
use App\Http\Controllers\Api\v1\ClassesController;
use App\Http\Controllers\Api\v1\ResultsController;
use App\Http\Controllers\Api\v1\JoinedclassController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use LDAP\Result;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//rest api
Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\Api\v1'], function (){
    Route::apiResource('levels', LevelsController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('classes', ClassesController::class);
    Route::get('classes/joinedclass/{user_id}', [ClassesController::class , 'UserJoinedClass']);
    Route::apiResource('results', ResultsController::class);
    Route::apiResource('joinedclass', JoinedclassController::class);
    
    Route::middleware(['api', 'web'])->group(function () {
        Route::post('/login', [UserController::class, 'login']);
    });
});
