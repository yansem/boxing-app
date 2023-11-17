<template>
        <template v-if="!isWorkoutStart">
            <div class="flex justify-center">
                <general-form/>
            </div>
            <hr class="w-full mb-2">
            <simple-mode v-if="!workout.isExpand"/>
            <expand-mode v-else/>
        </template>
        <template v-else>
            <workout-timer :round-count="roundCount" :timer="timer"/>
        </template>
</template>

<script setup>
import useWorkout from "@/composables/workout.js";
import {onBeforeMount} from "vue";
import {useRoute} from "vue-router";
import GeneralForm from "@/components/GeneralForm.vue";
import SimpleMode from "@/components/SimpleMode.vue";
import ExpandMode from "@/components/ExpandMode.vue";
import WorkoutTimer from "@/components/WorkoutTimer.vue";
import {round} from "lodash";

const {
    workout,
    isWorkoutStart,
    timer,
    roundCount,
    init,
    start,
} = useWorkout(useRoute().name);

onBeforeMount(async () => {
    await init();
})

</script>
