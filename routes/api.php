<?php

use App\Http\Controllers\Api\v1\DialogueController;
use App\Http\Controllers\Api\v1\LevelController;
use App\Http\Controllers\Api\v1\PerformanceController;
use App\Http\Controllers\Api\v1\StudentController;
use App\Http\Controllers\Api\v1\TeacherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
   Route::apiResource('teachers', TeacherController::class);
   Route::apiResource('students', StudentController::class);
   Route::apiResource('levels', LevelController::class);
   Route::apiResource('performances', PerformanceController::class);
   Route::apiResource('dialogues', DialogueController::class);
});
