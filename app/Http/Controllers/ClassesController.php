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
        $data = Classes::all();
        return view('classes.index', compact('data'));
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
        return redirect()->route('classes.index')->with('success', 'Class added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $class = Classes::findOrFail($id);
        $levels = Levels::where('class_id', $id)->get();
        return view('classes.show', compact('class' , 'levels'));
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
        return redirect()->route('classes.index')->with('success', 'Class deleted successfully.');
    }
}
