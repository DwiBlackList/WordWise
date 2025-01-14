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

    public function DashboardPage() {

        $weakestTopics = app(DashboardController::class)->Weakness()->getData();
        $strongestTopics = app(DashboardController::class)->Strength()->getData();
        $leaders = app(DashboardController::class)->Leadboard()->getData();
        $activity = app(DashboardController::class)->Activity()->getData();
        $currentKnowledge = app(DashboardController::class)->CurrentKnowledge()->getData();

        return view('dashboard', [
            'ssrData' => json_encode([
                'weakestTopics' => $weakestTopics->weakestTopics ?? [],
                'strongestTopics' => $strongestTopics->strongestTopics ?? [],
                'leaders' => $leaders->leaders ?? [],
                'activity' => $activity->activity ?? [],
                'currentKnowledge' => $currentKnowledge,
            ]),
        ]);
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

