<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use App\Models\Levels;
use Auth;
use Illuminate\Http\Request;
use App\Models\Results;
use App\Models\User;

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
        $dataUserLogin = app(Controller::class)->dataUserLogin()->getData();
        $weakestTopics = app(DashboardController::class)->Weakness()->getData();
        $strongestTopics = app(DashboardController::class)->Strength()->getData();
        $leaders = app(DashboardController::class)->Leadboard()->getData();
        $activity = app(DashboardController::class)->ActivityLama()->getData();

        // List Kelas Untuk menampilkan seluruh kelas yang ada pada user tersebut , digunakan untuk ngelink dropdown
        $ListClass = $this->ListClass();
        $FirstClass = $this->FirstClass()->getData();

        return view('dashboard', [
            'ssrData' => json_encode([
                'weakestTopics' => $weakestTopics->weakestTopics ?? [],
                'strongestTopics' => $strongestTopics->strongestTopics ?? [],
                'leaders' => $leaders->leaders ?? [],
                'activity' => $activity->activity ?? [],
                'currentKnowledge' => $currentKnowledge ?? [],
                'listClass' => $ListClass->original ?? [],
                'firstClass' => $FirstClass ?? [],
                'dataUserLogin' => $dataUserLogin ?? [],

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

    public function FirstClass()
    {
        $ListClass = $this->ListClass()->getData();
        $FirstClass = $ListClass[0] ?? [];
        // dd($FirstClass);
        return response()->json($FirstClass);
    }

    public function Leadboarda()
    {
        $firstClass = $this->FirstClass()->getData();
        if ($firstClass) {
            $classId = $firstClass->id;

            $users = User::whereHas('joinedclass', function ($query) use ($classId) {
                $query->where('class_id', $classId);
            })->with(['results' => function ($query) {
                $query->with('level');
            }])->get();

            $leaders = $users->map(function ($user) {
                $totalScoreCount = $user->results->reduce(function ($carry, $result) {
                    return $carry + count(json_decode($result->score, true));
                }, 0);

                return [
                    'name' => $user->name,
                    'rank' => $totalScoreCount,
                ];
            })->sortBy('rank')->values()->take(5);
            dd($leaders);
            return response()->json([
                'leaders' => $leaders
            ]);
        } else {
            return response()->json([
                'leaders' => []
            ]);
        }
    }

    public function Leadboard()
    {
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

    public function Weakness()
    {
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

    public function Strength()
    {
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

    function Activity()
    {
        $firstClass = $this->FirstClass()->getData();
        if ($firstClass) {
            $classId = $firstClass->id;

            $results = Results::whereHas('level', function ($query) use ($classId) {
                $query->where('class_id', $classId);
            })->get();

            $activity = $results->groupBy(function ($result) {
                return \Carbon\Carbon::parse($result->created_at)->format('m-Y');
            })->map(function ($group) {
                return $group->count();
            })->sortKeysUsing(function ($a, $b) {
                return \Carbon\Carbon::createFromFormat('m-Y', $a)->timestamp - \Carbon\Carbon::createFromFormat('m-Y', $b)->timestamp;
            });

            dd($activity);

            return response()->json([
                'activity' => $activity
            ]);
        } else {
            return response()->json([
                'activity' => []
            ]);
        }
    }

    public function ActivityLama()
    {
        return response()->json(
            [
                'activity' => [
                    110,
                    120,
                    100,
                    250,
                    280,
                    300,
                    200,
                    230,
                    230,
                    350,
                    380,
                    400
                ],
            ],
        );
    }
}
