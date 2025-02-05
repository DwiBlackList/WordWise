<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Classes;
use App\Models\Levels;
use Auth;
use Illuminate\Support\Str;

class ClassesController extends Controller
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
        $userId = Auth::id();
        $dataUserLogin = app(Controller::class)->dataUserLogin()->getData();
        $data = Classes::where('user_id', $userId)->get();

        // Combine data
        $combinedData = [
            'classes' => $data,
            'user' => $dataUserLogin
        ];

        $ssrData = json_encode($combinedData);
        return view('table', compact('ssrData'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi data
        $request->validate([
            'class_name' => 'required|string|max:255',
        ]);

        // Ambil id_user dari auth
        $userId = Auth::id();

        // Simpan data ke database
        Classes::create([
            'class_name' => $request->input('class_name'),
            'token' => Str::random(10),
            'user_id' => $userId,
        ]);

        // Redirect ke halaman sebelumnya dengan pesan sukses
        // return redirect()->route('classes.index')->with('success', 'Class created successfully.');
        return response()->json(['success' => 'Class added successfully'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $class = Classes::find($id);

        // Check if the class exists
        if (!$class) {
            abort(404, 'Class not found');
        }

        // Check if the logged-in user is the owner of the class
        if ($class->user_id !== Auth::id()) {
            abort(401, 'Unauthorized access');
        }

        $dataUserLogin = app(Controller::class)->dataUserLogin()->getData();

        $class = Classes::findOrFail($id);
        $levels = Levels::where('class_id', $id)->get();
        $userjoined = User::whereHas('joinedclass', function ($query) use ($id) {
            $query->where('class_id', $id);
        })->get();
        // dd($levels);




        $combinedData = [
            'class' => $class,
            'levels' => $levels,
            'dataUserLogin' => $dataUserLogin,
            'students' => $userjoined,
        ];

        $ssrData = json_encode($combinedData);


        return view('levelCRUD', compact('ssrData'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $class = Classes::findOrFail($id);
        return response()->json($class);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validasi data
        $request->validate([
            'class_name' => 'required|string|max:255',
        ]);

        // Update data di database
        $class = Classes::findOrFail($id);
        $class->update([
            'class_name' => $request->input('class_name'),
        ]);

        // Redirect ke halaman sebelumnya dengan pesan sukses
        return redirect()->route('classes.index')->with('success', 'Class updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $class = Classes::findOrFail($id);
        $class->delete();

        // Redirect ke halaman sebelumnya dengan pesan sukses
        // return redirect()->route('classes.index')->with('success', 'Class deleted successfully.');
        return response()->json(['success' => 'Class deleted successfully'], 201);
    }
}
