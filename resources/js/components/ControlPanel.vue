<template>
    <div class="flex flex-col">
        <div class="flex justify-center">
            <button class="bg-yellow-400 py-2 px-4 rounded">
                <StopIcon @click="stop" class="h-5 w-5"/>
            </button>
            <button v-if="isPaused" @click="resume" class="bg-yellow-400 py-2 px-4 rounded">
                <PlayIcon   class="h-5 w-5"/>
            </button>
            <button v-if="!isPaused" @click="pause" class="bg-yellow-400 py-2 px-4 rounded">
                <PauseIcon class="h-5 w-5"/>
            </button>
        </div>
    </div>
</template>

<script setup>

import {PauseIcon, PlayIcon, StopIcon} from "@heroicons/vue/24/solid/index.js";
import useWorkout from "@/composables/workout.js";

const {stop, pause, resume, isPaused} = useWorkout();

</script>
