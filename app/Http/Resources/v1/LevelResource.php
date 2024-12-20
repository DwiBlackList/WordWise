<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Resources\Json\JsonResource;

class LevelResource extends JsonResource
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
            'level_id' => $this->level_id,
            'title' => $this->title,
            'description' => $this->description,
            'level_data' => $this->level_data,
            'created_by' => $this->created_by,
            'created_at' => $this->created_at,
            'is_default' => $this->is_default,
        ];
    }
}
