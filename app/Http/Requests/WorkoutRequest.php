<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WorkoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['string'],
            'isExpand' => ['boolean'],
            'voiceSelected' => ['string'],
            'prepareTimeS' => ['integer'],
            'totalTime' => ['integer'],
            'params' => ['array'],
            'params.roundCount' => ['exclude_if:isExpand,true', 'integer'],
            'params.roundTimeS' => ['exclude_if:isExpand,true', 'integer'],
            'params.punchCount' => ['exclude_if:isExpand,true', 'integer'],
            'params.checked' => ['exclude_if:isExpand,true', 'array'],
            'params.checked.*' => ['exclude_if:isExpand,true', 'integer'],
            'params.selectAll' => ['exclude_if:isExpand,true', 'boolean'],
            'params.restBetweenPunchS' => ['exclude_if:isExpand,true', 'integer'],
            'params.restBetweenRoundsS' => ['exclude_if:isExpand,true', 'integer'],
            'params.*.roundCount' => ['exclude_if:isExpand,false', 'integer'],
            'params.*.roundTimeS' => ['exclude_if:isExpand,false', 'integer'],
            'params.*.punchCount' => ['exclude_if:isExpand,false', 'integer'],
            'params.*.checked' => ['exclude_if:isExpand,false', 'array'],
            'params.*.checked.*' => ['exclude_if:isExpand,false', 'integer'],
            'params.*.selectAll' => ['exclude_if:isExpand,false', 'boolean'],
            'params.*.restBetweenPunchS' => ['exclude_if:isExpand,false', 'integer'],
            'params.*.restBetweenRoundsS' => ['exclude_if:isExpand,false', 'integer'],
        ];
    }
}
