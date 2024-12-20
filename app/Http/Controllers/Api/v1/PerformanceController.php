<?php

namespace App\Http\Controllers\Api\v1;

use App\Models\Performance;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PerformanceController extends Controller
{
    public function index()
    {
        return Performance::all();
    }

    public function show($id)
    {
        return Performance::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,student_id',
            'level_id' => 'required|exists:levels,level_id',
            'score' => 'required|integer',
            'error_percentage' => 'required|numeric',
            'completed_at' => 'nullable|date',
        ]);

        $performance = Performance::create($validated);

        return response()->json($performance, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'student_id' => 'sometimes|exists:students,student_id',
            'level_id' => 'sometimes|exists:levels,level_id',
            'score' => 'sometimes|integer',
            'error_percentage' => 'sometimes|numeric',
            'completed_at' => 'nullable|date',
        ]);

        $performance = Performance::findOrFail($id);
        $performance->update($validated);

        return response()->json($performance);
    }

    public function destroy($id)
    {
        $performance = Performance::findOrFail($id);
        $performance->delete();

        return response()->json(['message' => 'Performance deleted successfully']);
    }

    // Custom method to show performances by student ID
    public function showByStudent($studentId)
    {
        $performances = Performance::where('student_id', $studentId)->get();
        return response()->json($performances);
    }
}
