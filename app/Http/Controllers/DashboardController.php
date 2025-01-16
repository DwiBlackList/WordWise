<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use App\Models\Levels;
use Auth;
use Illuminate\Http\Request;
use App\Models\Results;

class DashboardController extends Controller
{
    // konstruktor accessable with login user only
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        // $userId = Auth::id();
        // $classes = Classes::where('user_id', $userId)->get();

        // $levels = Levels::where('class_id', 1)->get();
        // $results = Results::where('level_id', 2)->get();
        // $result = $results->sortByDesc(function($result) {
        //     return (int) explode('/', $result->score)[0];
        // });
        // dd($levels);

        $weakestTopics = app(DashboardController::class)->Weakness()->getData();
        $strongestTopics = app(DashboardController::class)->Strength()->getData();
        $leaders = app(DashboardController::class)->Leadboard()->getData();
        $activity = app(DashboardController::class)->Activity()->getData();
        $currentKnowledge = app(DashboardController::class)->CurrentKnowledge()->getData();

        $ListClass = $this->ListClass();
        // dd($ListClass);

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

    public function ListClass()
    {
        // Mengambil data list kelas berdasarkan id user yang login
        $userId = Auth::id();
        $classes = Classes::where('user_id', $userId)->get();
        return response()->json($classes);
    }
    public function Leadboard(){
        // $levels = Levels::where('class_id', $id)->get();
        // $results = Results::where('level_id', 2)->get();
        // $result = $results->sortByDesc(function($result) {
        //     return (int) explode('/', $result->score)[0];
        // });
        // dd($result);
        return response()->json([
            'leaders' => [
                ['name' => 'Name 1', 'rank' => 1],
                ['name' => 'Name 2', 'rank' => 2],
                ['name' => 'Name 3', 'rank' => 3],
                ['name' => 'Name 4', 'rank' => 4],
                ['name' => 'Name 5', 'rank' => 5],
                ['name' => 'Name 6', 'rank' => 6],
            ],
        ]);
    }
    public function Weakness(){
        return response()->json([
            'weakestTopics' => [
                [
                    'topic' => 'Error Topic #1',
                    'percentage' => 74,
                ],
                [
                    'topic' => 'Error Topic #2',
                    'percentage' => 50,
                ],
                [
                    'topic' => 'Error Topic #3',
                    'percentage' => 74,
                ],
            ],
        ]);
    }

    public function Strength(){
        return response()->json([
            'strongestTopics' => [
                [
                    'topic' => 'Strong Topic #1',
                    'percentage' => 74,
                ],
                [
                    'topic' => 'Strong Topic #2',
                    'percentage' => 74,
                ],
                [
                    'topic' => 'Strong Topic #3',
                    'percentage' => 74,
                ],
            ],
        ]);
    }

    public function Activity(){
        return response()->json([
            'activity' => [
                110, 120, 100, 250, 280, 300, 200, 230, 230, 350, 380, 400
            ],
        ],
    );
    }

    public function CurrentKnowledge(){
        return response()->json([
            'labels' => [  "12-01-2023",
            "01-01-2024",
            "02-01-2024",
            "03-01-2024",
            "04-01-2024",
            "05-01-2024",
            "06-01-2024",
            "07-01-2024",
            "08-01-2024",
            "09-01-2024",
        ],
        'value' => [  732, 610, 610, 504, 504, 504, 349, 349, 504, 342],
    ]);
    }

    public function LevelProgress(){
        return response()->json([
            'level' => "Level Complete",
            'progress' => "Greate Progress",
            'current' => 3,
            'total' => 5,
        ]);
    }

    public function DataTable(){
        return response()->json([
            'data' => [
                [
                    "name" => "Tiger Nixon",
                    "content1" => "System Architect",
                    "content2" => "Edinburgh",
                    "content3" => "61",
                ],
                [
                    "name" => "Garrett Winters",
                    "content1" => "Accountant",
                    "content2" => "Tokyo",
                    "content3" => "63",
                ],
                [
                    "name" => "Ashton Cox",
                    "content1" => "Junior Technical Author",
                    "content2" => "San Francisco",
                    "content3" => "66",
                ],
                [
                    "name" => "Cedric Kelly",
                    "content1" => "Senior Javascript Developer",
                    "content2" => "Edinburgh",
                    "content3" => "22",
                ],
                [
                    "name" => "Airi Satou",
                    "content1" => "Accountant",
                    "content2" => "Tokyo",
                    "content3" => "33",
                ],
                [
                    "name" => "Brielle Williamson",
                    "content1" => "Integration Specialist",
                    "content2" => "New York",
                    "content3" => "61",
                ],
                [
                    "name" => "Herrod Chandler",
                    "content1" => "Sales Assistant",
                    "content2" => "San Francisco",
                    "content3" => "59",
                ],
                [
                    "name" => "Rhona Davidson",
                    "content1" => "Integration Specialist",
                    "content2" => "Tokyo",
                    "content3" => "55",
                ],
                [
                    "name" => "Colleen Hurst",
                    "content1" => "Javascript Developer",
                    "content2" => "San Francisco",
                    "content3" => "39",
                ],
                [
                    "name" => "Sonya Frost",
                    "content1" => "Software Engineer",
                    "content2" => "Edinburgh",
                    "content3" => "23",
                ],
                [
                    "name" => "Jena Gaines",
                    "content1" => "Office Manager",
                    "content2" => "London",
                    "content3" => "30",
                ],
                [
                    "name" => "Quinn Flynn",
                    "content1" => "Support Lead",
                    "content2" => "Edinburgh",
                    "content3" => "22",
                ],
                [
                    "name" => "Charde Marshall",
                    "content1" => "Regional Director",
                    "content2" => "San Francisco",
                    "content3" => "36",
                ],
            ],
        ]);
    }
}
