<template>
    <div class="flex flex-col">
        <div class="flex justify-center">
            <button @click="stop" class="bg-yellow-400 py-2 px-4 rounded">
                <i class="fa-solid fa-stop" style="color: #000000;"></i>
            </button>
            <button v-if="isPaused" @click="resume" class="bg-yellow-400 py-2 px-4 rounded">
                <i class="fa-solid fa-play" style="color: #000000;"></i>
            </button>
            <button v-if="!isPaused" @click="pause" class="bg-yellow-400 py-2 px-4 rounded">
                <i class="fa-solid fa-pause" style="color: #000000;"></i>
            </button>
        </div>
    </div>
</template>

<script setup>

import useWorkout from "@/composables/workout.js";

const {stop, pause, resume, isPaused} = useWorkout();

</script>
