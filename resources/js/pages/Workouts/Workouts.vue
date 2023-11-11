<template>
    <div v-if="!isLoading" class="flex">
        <aside class="w-64 bg-gray-500 p-4 h-screen">
            <router-link :to="{name: 'workouts.create'}" class="text-white text-2xl font-semibold mb-4">Добавить тренировку</router-link>
            <ul>
                <li v-for="work in workouts" class="mb-2">
                    <button @click="changeWorkout(work)" class="text-white hover:text-yellow-400">
                        {{ work.title }}
                    </button>
                </li>
            </ul>
        </aside>
        <div class="flex flex-col items-center flex-grow">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import InputNumber from "@/components/Form/InputNumber.vue";
import InputCheckbox from "@/components/Form/InputCheckbox.vue";
import useWorkout from "@/composables/workout.js";
import {onBeforeMount, onMounted, ref} from "vue";
import {useRoute} from "vue-router";

const {
    voices,
    workout,
    workouts,
    punches,
    init,
    getVoices,
    getWorkouts,
    start,
    addRound,
    removeRound,
    changeMode,
    changeWorkout,
    workoutAdd,
    sleep
} = useWorkout();

const isLoading = ref(true);

onBeforeMount(async () => {
    await getWorkouts();
    isLoading.value = false;
})

</script>
