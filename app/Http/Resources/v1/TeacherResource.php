<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Resources\Json\JsonResource;

class TeacherResource extends JsonResource
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
            'id' => $this->teacher_id,
            'name' => $this->name,
            'sprite' => $this->sprite,
            'bio' => $this->bio,
//            'user' => new UserResource($this->whenLoaded('user')), // Use UserResource if available
            'students' => StudentResource::collection($this->whenLoaded('students')), // Use StudentResource for each student if loaded
        ];
    }
}
