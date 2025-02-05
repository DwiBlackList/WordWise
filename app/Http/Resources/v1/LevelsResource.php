<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Resources\Json\JsonResource;

class LevelsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'class_id' => $this->class_id,
            'dialogue_data' => $this->dialogue_data,
            'level_name' => $this->level_name,
        ];
    }
}