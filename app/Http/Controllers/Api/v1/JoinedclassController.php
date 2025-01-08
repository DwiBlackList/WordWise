<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\JoinedclassResource;
use App\Models\Joinedclass;
use App\Models\Classes;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class JoinedclassController extends Controller
{
    /**
     * Display a listing of the joinedclasss.
     *
     * @return AnonymousResourceCollection
     */
    // public function index(): AnonymousResourceCollection
    // {
    //     return JoinedclassResource::collection(Joinedclass::all());
    // }

    /**
     * Store a newly created joinedclass in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required',
            'token' => 'required'
        ]);
    
        $class = Classes::where('token', $request->input('token'))
                        ->first();
    
        if (!$class) {
            return response()->json([
                'message' => 'Invalid class token / class not found'
            ], 400);
        }
    
        $joinedclass = Joinedclass::create([
            'user_id' => $request->input('user_id'),
            'class_id' => $class->id,
        ]);
    
        return response()->json([
            'message' => 'Join class successfully',
            'data' => new JoinedclassResource($joinedclass)
        ], 201);
    }

    /**
     * Display the specified joinedclass.
     *
     * @param  int  $id
     * @return JoinedclassResource
     */
    // public function show($id): JoinedclassResource
    // {
    //     $joinedclass = Joinedclass::findOrFail($id);

    //     return new JoinedclassResource($joinedclass);
    // }

    /**
     * Update the specified joinedclass in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return JsonResponse
     */
    // public function update(Request $request, $id): JsonResponse
    // {
    //     $joinedclass = Joinedclass::findOrFail($id);

    //     $validated = $request->validate([
    //         'dialogue_data' => 'required|string',
    //         'joinedclass_name' => 'required|string|max:255',
    //         'class_id' => 'required|integer',
    //     ]);

    //     $joinedclass->update($validated);

    //     return response()->json([
    //         'message' => 'Joinedclass updated successfully',
    //         'data' => new JoinedclassResource($joinedclass)
    //     ]);
    // }

    /**
     * Remove the specified joinedclass from storage.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    // public function destroy($id): JsonResponse
    // {
    //     $joinedclass = Joinedclass::findOrFail($id);
    //     $joinedclass->delete();

    //     return response()->json([
    //         'message' => 'Joinedclass deleted successfully'
    //     ]);
    // }
}