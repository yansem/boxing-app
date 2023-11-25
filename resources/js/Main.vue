<template>
    <div v-if="isInitEnd">
        <template v-if="!isWorkoutStart">
            <general-form/>
            <simple-mode v-if="!workout.isExpand"/>
            <expand-mode v-else/>
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

const {
    workout,
    isWorkoutStart,
    init,
} = useWorkout(useRoute().name);

const isInitEnd = ref(false);

onBeforeMount(async () => {
    await init();
    isInitEnd.value = true;
});

</script>
