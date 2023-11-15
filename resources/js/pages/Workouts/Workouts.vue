<template>
    <div class="flex">
        <aside class="w-64 bg-gray-500 p-4 h-screen">
            <router-link :to="{name: 'workouts.create'}" class="text-white text-2xl font-semibold mb-4">Добавить
                тренировку
            </router-link>
            <template v-if="workouts.length > 0">
                <ul>
                    <li v-for="(work, index) in workouts" :key="index" class="mb-2 flex justify-between"
                        @mouseover="setHoveredItem(index)" @mouseout="setHoveredItem(null)">
                        <router-link :to="{name: 'workouts.show', params: {id: work.id}}"
                                     class="text-white hover:text-yellow-400">{{ work.title }}
                        </router-link>
                        <button v-show="hoveredItem === index" @click="workoutDelete" class="text-red-500">
                            <TrashIcon class="h-5 w-5"/>
                        </button>
                    </li>
                </ul>
            </template>
            <template v-else>
                Тренировок пока нет...
            </template>
        </aside>
        <div class="flex flex-col items-center flex-grow">
                <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import {TrashIcon} from '@heroicons/vue/24/outline';
import useWorkout from "@/composables/workout.js";
import {onBeforeMount, ref, watch} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const hoveredItem = ref(null);

const {workouts, workoutDelete} = useWorkout();

const setHoveredItem = (index) => {
    hoveredItem.value = index;
}

onBeforeMount(async () => {
    if (workouts.value.length > 0)
        await router.push({name: 'workouts.show', params: {id: workouts.value[workouts.value.length - 1].id}})
})

watch(() => router.currentRoute.value.name, (newName, oldName) => {
    if (workouts.value.length > 0
        && (router.currentRoute.value.name === 'workouts.show' || router.currentRoute.value.name === 'workouts')
        && (newName !== oldName))
        router.push({name: 'workouts.show', params: {id: workouts.value[workouts.value.length - 1].id}})
})

</script>
