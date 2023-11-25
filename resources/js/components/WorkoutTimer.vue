<template>
    <div class="flex flex-col items-center align-middle">
        <span class="text-5xl">{{ roundCount }}</span>
        <span class="text-5xl">{{ timer }}</span>
    </div>
</template>

<script setup>

import useWorkout from "@/composables/workout.js";

const {roundCount, timer} = useWorkout();

</script>
