<template>
    <template v-if="!isWorkoutStart">
        <general-form/>
        <template v-if="workout.params">
            <simple-mode v-if="!workout.isExpand"/>
            <expand-mode v-else/>
        </template>
        <button class="bg-yellow-400 py-2 px-4 rounded" v-if="isWorkoutEdit" @click="workoutUpdate">Сохранить</button>
    </template>
    <template v-else>
        <div class="fixed inset-0 z-50" :class="{'bg-green-600': isPrepare, 'bg-red-600': isWork, 'bg-blue-500': isRest}">
            <control-panel/>
            <workout-timer/>
        </div>
    </template>
</template>

<script setup>
import useWorkout from "@/composables/workout.js";
import {onMounted, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import ExpandMode from "@/components/ExpandMode.vue";
import SimpleMode from "@/components/SimpleMode.vue";
import GeneralForm from "@/components/GeneralForm.vue";
import ControlPanel from "@/components/ControlPanel.vue";
import WorkoutTimer from "@/components/WorkoutTimer.vue";

const route = useRoute();
const router = useRouter();

const {
    workout,
    isWorkoutEdit,
    isWorkoutStart,
    isPrepare,
    isWork,
    isRest,
    init,
    workoutUpdate
} = useWorkout(useRoute().name);

onMounted(async () => {
    await init();
})

watch(() => router.currentRoute.value.params.id, (newId, oldId) => {
    if (router.currentRoute.value.name === 'workouts.show')
        if (newId !== oldId) {
            init();
        }
});

</script>
