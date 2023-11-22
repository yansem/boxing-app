<template>
    <div v-if="isInitEnd">
        <template v-if="!isWorkoutStart">
            <div class="flex justify-center">
                <general-form/>
            </div>
            <hr class="w-full mb-2">
            <simple-mode v-if="!workout.isExpand"/>
            <expand-mode v-else/>
        </template>
        <template v-else>
            <div class="flex flex-col">
                <button @click="stop">STOP</button>
                <button @click="pause">PAUSE</button>
                <button @click="resume">RESUME</button>
            </div>
            <workout-timer :round-count="roundCount" :timer="timer"/>
        </template>
    </div>
</template>

<script setup>
import useWorkout from "@/composables/workout.js";
import {onBeforeMount, ref} from "vue";
import {useRoute} from "vue-router";
import GeneralForm from "@/components/GeneralForm.vue";
import SimpleMode from "@/components/SimpleMode.vue";
import ExpandMode from "@/components/ExpandMode.vue";
import WorkoutTimer from "@/components/WorkoutTimer.vue";

const {
    workout,
    isWorkoutStart,
    timer,
    roundCount,
    stop,
    pause,
    resume,
    init,
    start
} = useWorkout(useRoute().name);

const isInitEnd = ref(false);

onBeforeMount(async () => {
    await init();
    isInitEnd.value = true;
});

</script>
