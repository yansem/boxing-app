<template>
    <div v-if="isInitEnd">
        <template v-if="!isWorkoutStart">
            <general-form/>
            <simple-mode v-if="!workout.isExpand"/>
            <expand-mode v-else/>
        </template>
        <template v-else>
            <div class="fixed inset-0 z-50" :class="{'bg-green-600': isPrepare, 'bg-red-600': isWork, 'bg-blue-500': isRest}">
                <control-panel/>
                <workout-timer/>
            </div>
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
import ControlPanel from "@/components/ControlPanel.vue";
import WorkoutTimer from "@/components/WorkoutTimer.vue";

const {
    workout,
    isWorkoutStart,
    isPrepare,
    isWork,
    isRest,
    init,
} = useWorkout(useRoute().name);

const isInitEnd = ref(false);

onBeforeMount(async () => {
    await init();
    isInitEnd.value = true;
});

</script>
