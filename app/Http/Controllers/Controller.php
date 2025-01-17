<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\v1\DashboardController;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Auth;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /*
    Route::get('data/users/login', [Controller::class, 'dataUserLogin']);
    Mengambil data user yang sedang login , di pass ke D:\laragon\www\WordWise\resources\js\hooks\auth.ts
    Digunakan untuk sidebar
    Kemungkinan dipakai lagi buat pengecekkan user yang login
     */ 
    public function dataUserLogin() {
        $authUser = Auth::user();
        return response()->json($authUser);
    }
    public function TablePage(){

        $levelProgress = app(DashboardController::class)->LevelProgress()->getData();
        $dataTable = app(DashboardController::class)->DataTable()->getData();

        return view('table', [
            'ssrData' => json_encode([
                'levelProgress' => $levelProgress ?? [],
                'dataTable' => $dataTable ?? [],
            ])
        ]);
    }
    public function LandingPage(){
        return view('landing-page');
    }
    public function LoginPage(){
        return view('login');
    }



}

