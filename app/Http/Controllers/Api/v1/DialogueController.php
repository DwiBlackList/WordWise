<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\DialogueResource;
use App\Models\Dialogue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class DialogueController extends Controller
{
    /**
     * Display a listing of the dialogues.
     *
     * @return AnonymousResourceCollection
     */
    public function index(): AnonymousResourceCollection
    {
        return DialogueResource::collection(Dialogue::all());
    }

    /**
     * Store a newly created dialogue in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'dialogue_data' => 'required|string',
        ]);

        $dialogue = Dialogue::create($validated);

        return response()->json([
            'message' => 'Dialogue created successfully',
            'data' => new DialogueResource($dialogue)
        ], 201);
    }

    /**
     * Display the specified dialogue.
     *
     * @param  int  $id
     * @return DialogueResource
     */
    public function show($id): DialogueResource
    {
        $dialogue = Dialogue::findOrFail($id);

        return new DialogueResource($dialogue);
    }

    /**
     * Update the specified dialogue in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(Request $request, $id): JsonResponse
    {
        $dialogue = Dialogue::findOrFail($id);

        $validated = $request->validate([
            'dialogue_data' => 'required|string',
        ]);

        $dialogue->update($validated);

        return response()->json([
            'message' => 'Dialogue updated successfully',
            'data' => new DialogueResource($dialogue)
        ]);
    }

    /**
     * Remove the specified dialogue from storage.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        $dialogue = Dialogue::findOrFail($id);
        $dialogue->delete();

        return response()->json(['message' => 'Dialogue deleted successfully']);
    }
}
