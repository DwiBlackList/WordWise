<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\TeacherResource;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{
    /**
     * Display a listing of the teachers.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        $teachers = Teacher::with(['user'])->get();
        return TeacherResource::collection($teachers);
    }

    /**
     * Store a newly created teacher in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        // Validate the request data for both User and Teacher fields
        $validated = $request->validate([
            // Teacher fields
            'name' => 'required|string|max:255',
            'sprite' => 'nullable|integer|min:0|max:65535',
            'bio' => 'nullable|string',

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

        // Now create the Teacher and associate it with the newly created User
        $teacher = Teacher::create([
            'name' => $validated['name'],
            'sprite' => $validated['sprite'],
            'bio' => $validated['bio'],
            'user_id' => $user->id, // Associate with the newly created User
        ]);

        return response()->json([
            'message' => 'Teacher created successfully',
            'data' => $teacher
        ], 201);
    }

    /**
     * Display the specified teacher.
     *
     * @param  int  $id
     * @return TeacherResource
     */
    public function show($id)
    {
        $teacher = Teacher::with(['user', 'students'])->findOrFail($id);
        return new TeacherResource($teacher);
    }

    /**
     * Update the specified teacher in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(Request $request, $id)
    {
        $teacher = Teacher::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'sprite' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'user_id' => 'sometimes|exists:users,id',
        ]);

        $teacher->update($validated);

        return response()->json($teacher);
    }

    /**
     * Remove the specified teacher from storage.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);
        $teacher->delete();

        return response()->json(['message' => 'Teacher deleted successfully']);
    }

    /**
     * Display students for the specified teacher.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function students($id)
    {
        $teacher = Teacher::findOrFail($id);
        $students = $teacher->students;

        return response()->json($students);
    }
}
