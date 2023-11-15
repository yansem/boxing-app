<template>
        <general-form/>
        <template v-if="workout.params">
            <simple-mode v-if="!workout.isExpand"/>
            <expand-mode v-else/>
        </template>
        <button class="bg-yellow-400 py-2 px-4 rounded" v-if="isWorkoutEdit" @click="workoutUpdate">Сохранить</button>
</template>

<script setup>
import useWorkout from "@/composables/workout.js";
import {onMounted, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import ExpandMode from "@/components/ExpandMode.vue";
import SimpleMode from "@/components/SimpleMode.vue";
import GeneralForm from "@/components/GeneralForm.vue";

const route = useRoute();
const router = useRouter();

const {
    workout,
    workouts,
    isWorkoutEdit,
    init,
    start,
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
