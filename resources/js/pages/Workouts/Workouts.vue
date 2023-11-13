<template>
    <div class="flex">
        <aside class="w-64 bg-gray-500 p-4 h-screen">
            <router-link :to="{name: 'workouts.create'}" class="text-white text-2xl font-semibold mb-4">Добавить
                тренировку
            </router-link>
            <ul>
                <li v-for="work in workouts" class="mb-2">
                    <router-link :to="{name: 'workouts.show', params: {id: work.id}}"
                                 class="text-white hover:text-yellow-400">{{ work.title }}
                    </router-link>
                </li>
            </ul>
        </aside>
        <div class="flex flex-col items-center flex-grow">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import useWorkout from "@/composables/workout.js";
import {onBeforeMount, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const route = useRoute();

const {workouts} = useWorkout();

onBeforeMount(async () => {
    await router.push({name: 'workouts.show', params: {id: workouts.value[workouts.value.length - 1].id}})
})

watch(() => router.currentRoute.value.name, (newName, oldName) => {
    if (newName !== oldName)
        router.push({name: 'workouts.show', params: {id: workouts.value[workouts.value.length - 1].id}})
})

</script>
