<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\LevelsResource;
use App\Models\Levels;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class LevelsController extends Controller
{
    /**
     * Display a listing of the levels.
     *
     * @return AnonymousResourceCollection
     */
    // public function index(): AnonymousResourceCollection
    // {
    //     return LevelsResource::collection(Levels::all());
    // }

    /**
     * Store a newly created level in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    // public function store(Request $request): JsonResponse
    // {
    //     // $validated = $request->validate([
    //     //     'level_data' => 'required|string',
    //     // ]);

    //     $level = Levels::create([
    //         'class_id' => $request->input('class_id'),
    //         'level_name' => $request->input('level_name'),
    //         'dialogue_data' => $request->input('dialogue_data'),
    //     ]);

    //     return response()->json([
    //         'message' => 'Levels created successfully',
    //         'data' => new LevelsResource($level)
    //     ], 201);
    // }

    /**
     * Display the specified level.
     *
     * @param  int  $id
     * @return LevelsResource
     */
    public function show($id): LevelsResource
    {
        $level = Levels::findOrFail($id);

        return new LevelsResource($level);
    }

    /**
     * Update the specified level in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return JsonResponse
     */
    // public function update(Request $request, $id): JsonResponse
    // {
    //     $level = Levels::findOrFail($id);

    //     $validated = $request->validate([
    //         'dialogue_data' => 'required|string',
    //         'level_name' => 'required|string|max:255',
    //         'class_id' => 'required|integer',
    //     ]);

    //     $level->update($validated);

    //     return response()->json([
    //         'message' => 'Levels updated successfully',
    //         'data' => new LevelsResource($level)
    //     ]);
    // }

    /**
     * Remove the specified level from storage.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    // public function destroy($id): JsonResponse
    // {
    //     $level = Levels::findOrFail($id);
    //     $level->delete();

    //     return response()->json([
    //         'message' => 'Levels deleted successfully'
    //     ]);
    // }
}