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
            'title' => $this->params['title'],
            'isExpand' => $this->params['isExpand'],
            'voiceSelected' => $this->params['voiceSelected'],
            'prepareTimeS' => $this->params['prepareTimeS'],
            'totalTime' => $this->params['totalTime'],
            'params' => $this->params['params']
        ];
    }
}
