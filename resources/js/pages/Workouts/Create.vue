<template>
    <template v-if="!isWorkoutStart">
        <general-form/>
        <template v-if="workout.params">
            <simple-mode v-if="!workout.isExpand"/>
            <expand-mode v-else/>
        </template>
        <button class="bg-yellow-400 py-2 px-4 rounded" @click="workoutStore">Сохранить</button>
    </template>
    <template v-else>
        <workout-timer :round-count="roundCount" :timer="timer"/>
    </template>
</template>

<script setup>
import useWorkout from "@/composables/workout.js";
import {onMounted} from "vue";
import {useRoute} from "vue-router";
import GeneralForm from "@/components/GeneralForm.vue";
import ExpandMode from "@/components/ExpandMode.vue";
import SimpleMode from "@/components/SimpleMode.vue";
import WorkoutTimer from "@/components/WorkoutTimer.vue";

const {
    workout,
    workouts,
    isWorkoutStart,
    roundCount,
    timer,
    init,
    start,
    workoutStore
} = useWorkout(useRoute().name);

onMounted(async () => {
    await init();
})


</script>
