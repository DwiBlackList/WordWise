<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Classes;
use App\Models\Levels;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class LevelsController extends Controller
{
    // konstruktor accessable with login user only
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($classId)
    {
        $class = Classes::find($classId);

        // Check if the class exists
        if (!$class) {
            abort(404, 'Class not found');
        }

        // Check if the logged-in user is the owner of the class
        if ($class->user_id !== Auth::id()) {
            abort(401, 'Unauthorized access');
        }

        return view('editor', ['classId' => $classId]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $level = Levels::findOrFail($id);

        // Get the class ID from the level
        $classId = $level->class_id;
        $dataUserLogin = app(Controller::class)->dataUserLogin()->getData();


        // Get users who have joined the class
        $users = User::whereHas('joinedclass', function ($query) use ($classId) {
            $query->where('class_id', $classId);
        })->with(['results' => function ($query) use ($id) {
            $query->where('level_id', $id);
        }])->get();

        $combinedData = [
            'level' => $level,
            'users' => $users,
            'dataUserLogin' => $dataUserLogin,

        ];

        $ssrData = json_encode($combinedData);


        return view('levelDetail', compact('ssrData'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $class = Levels::findOrFail($id);
        $class->delete();

        // Redirect ke halaman sebelumnya dengan pesan sukses
        // return redirect()->back()->with('success', 'Class deleted successfully.');
        return response()->json(['success' => 'Level deleted successfully'], 201);
    }
}
