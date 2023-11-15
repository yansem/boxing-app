<?php

namespace App\Http\Controllers;

use App\Http\Requests\WorkoutRequest;
use App\Http\Resources\WorkoutResource;
use App\Models\User;
use App\Models\Workout;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WorkoutController extends Controller
{
    public function index()
    {
        return WorkoutResource::collection(auth()->user()->workouts);
    }

    public function store(WorkoutRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data = [
            'user_id' => $request->user()->id,
            'params' => $data,
        ];
        Workout::create($data);

        return response()->json(['message' => 'Workout created'], Response::HTTP_CREATED);
    }

    public function update(WorkoutRequest $request, $id): JsonResponse
    {
        $data = $request->validated();
        $workout = Workout::findOrFail($id);
        $data = [
            'user_id' => $request->user()->id,
            'params' => $data,
        ];
        $workout->update($data);

        return response()->json(['message' => 'Workout updated'], Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        $workout = Workout::findOrFail($id);
        $workout->delete();

        return response()->json(['message' => 'Workout deleted'], Response::HTTP_OK);
    }
}
