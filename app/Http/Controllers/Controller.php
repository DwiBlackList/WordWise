<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\v1\DashboardController;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

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

