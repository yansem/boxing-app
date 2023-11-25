<template>
    <div class="flex">
        <aside class="w-64 bg-gray-500 p-4 min-h-screen flex-shrink-0">
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
        <div class="flex flex-col flex-grow">
            <template v-if="currentRouteName === 'workouts.show'">
                <router-view v-if="workouts.length > 0"/>
            </template>
            <router-view v-else/>
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

const currentRouteName = ref(router.currentRoute.value.name);

onBeforeMount(async () => {
    if (workouts.value.length > 0 && currentRouteName.value === 'workouts') {
        await router.push({name: 'workouts.show', params: {id: workouts.value[workouts.value.length - 1].id}})
    }
});

watch(() => router.currentRoute.value.name, (newName, oldName) => {
    if (workouts.value.length > 0 && router.currentRoute.value.name === 'workouts') {
        router.push({name: 'workouts.show', params: {id: workouts.value[workouts.value.length - 1].id}})
    }
})

</script>
