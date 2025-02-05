<?php

namespace App\Http\Controllers;

use App\Models\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
class UsersController extends Controller
{


    /**
     * Display a listing of the resource.
     * Mengambil semua data user
     * Endpoint /users GET
     */
    public function index()
    {
        $users = User::all();
        $dataUserLogin = app(Controller::class)->dataUserLogin()->getData();

        $combinedData = [
            'users' => $users,
            'dataUserLogin' => $dataUserLogin
        ];

        return view('usersCRUD', ['ssrData' => json_encode($combinedData)]);
    }

    /**
     * Show the form for creating a new resource.
     * Tidak Digunakan. Menggunakan Modal
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     * Menyimpan data user baru
     * Endpoint /users POST
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', Rules\Password::defaults()],
            'school' => ['required', 'string', 'max:255'],
            'role' => ['required'],
        ]);

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
            'school' => $request->input('school'),
            'role' => $request->input('role'),
        ]);

        return response()->json([
            'message' => 'Data berhasil disimpan'
        ], 200);
    }

    /**
     * Display the specified resource.
     * Endpoint /users/{id} GET
     */
    public function show(string $id)
    {
        $data = User::find($id);
        return response()->json($data);
    }

    /**
     * Show the form for editing the specified resource.
     * Endpoint /users/{id}/edit GET
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     * Endpoint /users/{id} PUT
     */
    public function update(Request $request, string $id)
    {
        $data = User::find($id);
        $data->update([$request->all() , 'password' => Hash::make($request->input('password'))]);
        return response()->json([
            'message' => 'Data berhasil diupdate'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     * Endpoint /users/{id} DELETE
     */
    public function destroy(string $id)
    {
        $data = User::find($id);
        $data->delete();
        return response()->json([
            'message' => 'Data berhasil dihapus'
        ], 200);
    }
}
