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
        $dataUserLogin = app(Controller::class)->dataUserLogin()->getData();
        $weakestTopics = $this->Weakness()->getData();
        $strongestTopics = $this->Strength()->getData();
        // $leaders = $this->Leadboard()->getData();
        $activity = $this->Activity()->getData();
        $currentKnowledge = $this->Activity()->getData();
        $ListClass = $this->ListClass();
        $FirstClass = $this->FirstClass()->getData();
        $topFirst5 = $this->Top5()->getData();
        $topLast5 = $this->Top5FromBack()->getData();

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
                'topFirst5' => $topFirst5->leaders ?? [],
                'topLast5' => $topLast5->leaders ?? [],

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

    public function Top5()
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
                $totalScoreObtained = 0;
                $totalScoreAvailable = 0;

                $user->results->each(function ($result) use (&$totalScoreObtained, &$totalScoreAvailable) {
                    $scoreParts = explode('/', $result->score);
                    $scoreObtained = isset($scoreParts[0]) ? (int)$scoreParts[0] : 0;
                    $scoreAvailable = isset($scoreParts[1]) ? (int)$scoreParts[1] : 0;

                    $totalScoreObtained += $scoreObtained;
                    $totalScoreAvailable += $scoreAvailable;
                });

                $accuracy = $totalScoreAvailable > 0 ? ($totalScoreObtained / $totalScoreAvailable) * 100 : 0;

                return [
                    'name' => $user->name,
                    'totalscore' => $totalScoreObtained,
                    'accuracy' => round($accuracy, 2), // Rounded to 2 decimal places
                ];
            })->sortByDesc('totalscore')->values()->take(5);

            // dd($leaders);

            return response()->json([
                'leaders' => $leaders
            ]);
        } else {
            return response()->json([
                'leaders' => []
            ]);
        }
    }

    public function Top5FromBack()
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
                $totalScoreObtained = 0;
                $totalScoreAvailable = 0;

                $user->results->each(function ($result) use (&$totalScoreObtained, &$totalScoreAvailable) {
                    $scoreParts = explode('/', $result->score);
                    $scoreObtained = isset($scoreParts[0]) ? (int)$scoreParts[0] : 0;
                    $scoreAvailable = isset($scoreParts[1]) ? (int)$scoreParts[1] : 0;

                    $totalScoreObtained += $scoreObtained;
                    $totalScoreAvailable += $scoreAvailable;
                });

                $accuracy = $totalScoreAvailable > 0 ? ($totalScoreObtained / $totalScoreAvailable) * 100 : 0;

                return [
                    'name' => $user->name,
                    'totalscore' => $totalScoreObtained,
                    'accuracy' => round($accuracy, 2), // Rounded to 2 decimal places
                ];
            })->sortBy('totalscore')->values()->take(5);

            // dd($leaders);

            return response()->json([
                'leaders' => $leaders
            ]);
        } else {
            return response()->json([
                'leaders' => []
            ]);
        }
    }

    public function Weakness()
    {
        $firstClass = $this->FirstClass()->getData();
        if ($firstClass) {
            $classId = $firstClass->id;

            $levels = Levels::where('class_id', $classId)->with('results')->get();

            $weakestTopics = $levels->map(function ($level) {
                $totalErrors = $level->results->reduce(function ($carry, $result) {
                    $scoreParts = explode('/', $result->score);
                    $scoreObtained = isset($scoreParts[0]) ? (int)$scoreParts[0] : 0;
                    $scoreAvailable = isset($scoreParts[1]) ? (int)$scoreParts[1] : 0;
                    $errors = $scoreAvailable - $scoreObtained;
                    return $carry + $errors;
                }, 0);

                return [
                    'topic' => $level->level_name,
                    'percentage' => $totalErrors,
                ];
            })->sortBy('percentage')->values()->take(3);

            return response()->json([
                'weakestTopics' => $weakestTopics
            ]);
        } else {
            return response()->json([
                'weakestTopics' => []
            ]);
        }
    }

    public function Strength()
    {
        $firstClass = $this->FirstClass()->getData();
        if ($firstClass) {
            $classId = $firstClass->id;

            $levels = Levels::where('class_id', $classId)->with('results')->get();

            $strongestTopics = $levels->map(function ($level) {
                $totalErrors = $level->results->reduce(function ($carry, $result) {
                    $scoreParts = explode('/', $result->score);
                    $scoreObtained = isset($scoreParts[0]) ? (int)$scoreParts[0] : 0;
                    $scoreAvailable = isset($scoreParts[1]) ? (int)$scoreParts[1] : 0;
                    $errors = $scoreAvailable - $scoreObtained;
                    return $carry + $errors;
                }, 0);

                return [
                    'topic' => $level->level_name,
                    'percentage' => $totalErrors,
                ];
            })->sortByDesc('percentage')->values()->take(3);

            return response()->json([
                'strongestTopics' => $strongestTopics
            ]);
        } else {
            return response()->json([
                'strongestTopics' => []
            ]);
        }
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

            // dd($activity);

            return response()->json([
                'activity' => $activity
            ]);
        } else {
            return response()->json([
                'activity' => []
            ]);
        }
    }
}
