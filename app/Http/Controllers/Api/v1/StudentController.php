<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\StudentResource;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return StudentResource::collection(Student::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            // Student fields
            'name' => 'required|string|max:255',
            'sprite' => 'nullable|integer|min:0|max:65535',
            'level' => 'required|integer',
            'total_points' => 'required|integer',
            'teacher_id' => 'nullable|exists:teachers,teacher_id',

            // User fields
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Create the User first
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Now create the Student and associate it with the User
        $student = Student::create([
            'name' => $validated['name'],
            'sprite' => $validated['sprite'],
            'level' => $validated['level'],
            'total_points' => $validated['total_points'],
            'teacher_id' => $validated['teacher_id'],
            'user_id' => $user->id, // Associate with the newly created User
        ]);

        // Return the newly created student as a resource
        return new StudentResource($student);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return new StudentResource(Student::findOrFail($id));
    }

    /**
     * Display students by teacher ID.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function showByTeacher($id)
    {
        return response()->json(Student::where('teacher_id', $id)->get());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'sprite' => 'nullable|integer|min:0|max:65535',
            'level' => 'sometimes|integer',
            'total_points' => 'sometimes|integer',
            'teacher_id' => 'nullable|exists:teachers,teacher_id',
        ]);

        $student->update($validated);

        return new StudentResource($student);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return response()->json(['message' => 'Student deleted successfully']);
    }
}
