<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Resources\Json\JsonResource;

class PerformanceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->performance_id,
            'student_id' => $this->student_id,
            'level_id' => $this->level_id,
            'score' => $this->score,
            'error_percentage' => $this->error_percentage,
            'completed_at' => $this->completed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Include related data if you want to embed the student or level information
            'student' => new StudentResource($this->whenLoaded('student')),
            'level' => new LevelResource($this->whenLoaded('level')),
        ];
    }
}
