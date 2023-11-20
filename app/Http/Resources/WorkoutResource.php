<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkoutResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->params['title'],
            'isExpand' => $this->params['isExpand'],
            'voiceSelected' => $this->params['voiceSelected'],
            'prepareTimeM' => $this->params['prepareTimeM'],
            'prepareTimeS' => $this->params['prepareTimeS'],
            'params' => $this->params['params']
        ];
    }
}
