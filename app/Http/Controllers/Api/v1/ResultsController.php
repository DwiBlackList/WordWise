<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\ResultsResource;
use App\Models\Results;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ResultsController extends Controller
{
    /**
     * Display a listing of the results.
     *
     * @return AnonymousResourceCollection
     */
    public function index(): AnonymousResourceCollection
    {
        return ResultsResource::collection(Results::all());
    }

    /**
     * Store a newly created result in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required',
            'level_id' => 'required',
            'score' => 'required',
        ]);
    
        // Check if the result already exists
        $result = Results::where('user_id', $request->input('user_id'))
                         ->where('level_id', $request->input('level_id'))
                         ->first();
    
        if ($result) {
            // Update the result if it already exists
            $result->update([
                'score' => $request->input('score'),
            ]);
    
            return response()->json([
                'message' => 'Results updated successfully',
                'data' => new ResultsResource($result)
            ], 200);
        } else {
            // Create a new result if it doesn't exist
            $result = Results::create([
                'user_id' => $request->input('user_id'),
                'level_id' => $request->input('level_id'),
                'score' => $request->input('score'),
            ]);
    
            return response()->json([
                'message' => 'Results created successfully',
                'data' => new ResultsResource($result)
            ], 201);
        }
    }

    /**
     * Display the specified result.
     *
     * @param  int  $id
     * @return ResultsResource
     */
    public function show($id): ResultsResource
    {
        $result = Results::findOrFail($id);

        return new ResultsResource($result);
    }

    /**
     * Update the specified result in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return JsonResponse
     */
    // public function update(Request $request, $id): JsonResponse
    // {
    //     $result = Results::findOrFail($id);

    //     $validated = $request->validate([
    //         'user_id' => 'required',
    //         'result_id' => 'required',
    //         'score' => 'required',
    //     ]);

    //     $result->update($validated);

    //     return response()->json([
    //         'message' => 'Results updated successfully',
    //         'data' => new ResultsResource($result)
    //     ]);
    // }

    /**
     * Remove the specified result from storage.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    // public function destroy($id): JsonResponse
    // {
    //     $result = Results::findOrFail($id);
    //     $result->delete();

    //     return response()->json([
    //         'message' => 'Results deleted successfully'
    //     ]);
    // }
}