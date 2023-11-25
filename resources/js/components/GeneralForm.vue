<template>
    <div class="flex justify-center">
        <table class="border-collapse border border-slate-400 mt-3">
            <tbody>
            <tr>
                <td class="border border-slate-300">Название</td>
                <td class="border border-slate-300 text-center">
                    <input v-model="workout.title" type="text" id="title">
                </td>
            </tr>
            <tr>
                <td class="border border-slate-300">Расширенный режим</td>
                <td class="border border-slate-300 text-center">
                    <input :checked="workout.isExpand" @change="changeMode" type="checkbox" id="expand">
                </td>
            </tr>
            <tr>
                <td class="border border-slate-300">Время подготовки, м:с</td>
                <td class="border border-slate-300 flex justify-center">
                    <input-number v-model="workout.prepareTimeM" :id="'prepare-time-m'"/>
                    :
                    <input-number v-model="workout.prepareTimeS" :id="'prepare-time-s'"/>
                </td>
            </tr>
            <tr>
                <td class="border border-slate-300">Общее время тренировки</td>
                <td class="border border-slate-300 text-center">
                    {{ workout.totalTime }}
                </td>
            </tr>
            <tr>
                <td class="border border-slate-300">Выберите голос озвучки</td>
                <td class="border border-slate-300 text-center">
                    <select v-model="workout.voiceSelected">
                        <option v-for="voice in voices" :value="voice.voiceURI">{{ voice.name }}</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td colspan="2" class="border border-slate-300">
                    <button class="w-full h-full bg-yellow-400 py-2 px-4 rounded" @click="start">Начать тренировку
                        онлайн
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>

import InputNumber from "@/components/Form/InputNumber.vue";
import useWorkout from "@/composables/workout.js";

const {
    workout,
    voices,
    changeMode,
    start
} = useWorkout();

</script>

<style scoped>

</style>