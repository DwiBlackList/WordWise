<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->student_id,
            'name' => $this->name,
            'sprite' => $this->sprite,
            'teacher_id' => $this->teacher_id,
            'level' => $this->level,
            'total_points' => $this->total_points
        ];
    }
}
