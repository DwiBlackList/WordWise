<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\ClassesResource;
use App\Models\Classes;
use App\Models\Levels;
use App\Models\Joinedclass;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ClassesController extends Controller
{
    /**
     * Display a listing of the classess.
     *
     * @return AnonymousResourceCollection
     */
    public function index(): AnonymousResourceCollection
    {
        return ClassesResource::collection(Classes::all());
    }


    public function UserJoinedClass($id)
    {
        $joinedClasses = Joinedclass::where('user_id', $id)
                                ->with('classes')
                                ->get();

        return response()->json([
            'user_joined_classes' => $joinedClasses
        ]);
    }
    
    // public function store(Request $request)
    // {
    //     // Validasi data
    //     $request->validate([
    //         'class_name' => 'required|string|max:255',
    //     ]);

    //     // Ambil id_user dari auth
    //     $userId = Auth::id();

    //     // Simpan data ke database
    //     Classes::create([
    //         'class_name' => $request->input('class_name'),
    //         'token' => Str::random(10),
    //         'user_id' => $userId,
    //     ]);

    //     // Redirect ke halaman sebelumnya dengan pesan sukses
    //     return response()->json(['success' => 'Class added successfully'], 201);
    // }


    /**
     * Store a newly created classes in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    // public function store(Request $request): JsonResponse
    // {
    //     // $validated = $request->validate([
    //     //     'classes_data' => 'required|string',
    //     // ]);

    //     $classes = Classes::create([
    //         'class_id' => $request->input('class_id'),
    //         'classes_name' => $request->input('classes_name'),
    //         'dialogue_data' => $request->input('dialogue_data'),
    //     ]);

    //     return response()->json([
    //         'message' => 'Classes created successfully',
    //         'data' => new ClassesResource($classes)
    //     ], 201);
    // }

    /**
     * Display the specified classes.
     *
     * @param  int  $id
     * @return ClassesResource
     */
    public function show($id)
    {
        $classes = Classes::findOrFail($id);
        $levels = Levels::where('class_id', $id)->get();

        return response()->json([
            'class' => $classes,
            'levels' => $levels
        ]);
    }

    /**
     * Update the specified classes in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return JsonResponse
     */
    // public function update(Request $request, $id): JsonResponse
    // {
    //     $classes = Classes::findOrFail($id);

    //     $validated = $request->validate([
    //         'dialogue_data' => 'required|string',
    //         'classes_name' => 'required|string|max:255',
    //         'class_id' => 'required|integer',
    //     ]);

    //     $classes->update($validated);

    //     return response()->json([
    //         'message' => 'Classes updated successfully',
    //         'data' => new ClassesResource($classes)
    //     ]);
    // }

    /**
     * Remove the specified classes from storage.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    // public function destroy($id): JsonResponse
    // {
    //     $classes = Classes::findOrFail($id);
    //     $classes->delete();

    //     return response()->json([
    //         'message' => 'Classes deleted successfully'
    //     ]);
    // }
}

