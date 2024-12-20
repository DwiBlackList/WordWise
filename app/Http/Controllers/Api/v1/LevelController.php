<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\LevelResource;
use App\Models\Level;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class LevelController extends Controller
{
    /**
     * Display a listing of the levels.
     *
     * @return AnonymousResourceCollection
     */
    public function index()
    {
        return LevelResource::collection(Level::all());
    }

    /**
     * Store a newly created level in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'nullable|string',
            'level_data' => 'nullable|string',
            'created_by' => 'nullable|integer',
            'is_default' => 'nullable|boolean',
        ]);


        $level = Level::create($validated);

        return response()->json([
            'message' => 'Level created successfully',
            'data' => new LevelResource($level)
        ], 201);
    }

    /**
     * Display the specified level.
     *
     * @param  int  $id
     * @return LevelResource
     */
    public function show($id)
    {
        $level = Level::findOrFail($id);

        return new LevelResource($level);
    }

    /**
     * Update the specified level in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(Request $request, $id)
    {
        $level = Level::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'level_data' => 'nullable|string',
            'created_by' => 'nullable|integer',
            'is_default' => 'nullable|boolean',
        ]);

        $level->update($validated);

        return response()->json([
            'message' => 'Level updated successfully',
            'data' => new LevelResource($level)
        ]);
    }

    /**
     * Remove the specified level from storage.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        $level = Level::findOrFail($id);
        $level->delete();

        return response()->json(['message' => 'Level deleted successfully']);
    }
}
