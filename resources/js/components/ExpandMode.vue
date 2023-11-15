<template>
    <div class="flex">
        <table v-for="(round, index) in workout.params" :key="index"
               class="border-collapse border border-slate-400">
            <tbody>
            <tr>
                <td colspan="2" class="border border-slate-300 text-center">
                    Раунд {{ index + 1 }}
                </td>
            </tr>
            <tr>
                <td class="border border-slate-300">Время раунда</td>
                <td class="border border-slate-300">
                    <input-number v-model="round.roundTimeS" :id="'round-time' + index"/>
                </td>
            </tr>
            <tr>
                <td class="border border-slate-300">Количество ударов</td>
                <td class="border border-slate-300">
                    <input-number v-model="round.punchCount" :id="'punch-count' + index"/>
                </td>
            </tr>
            <tr>
                <td class="border border-slate-300 ">Удары</td>
                <td class="border border-slate-300">
                    <div class="grid grid-cols-2 justify-items-center">
                        <template v-for="punch in punches" :key="punch">
                            <input-checkbox v-model="round.checked" :index="index" :punch="punch"/>
                        </template>
                    </div>
                    <div>
                        <input type="checkbox" :id="'all' + index" v-model="round.selectAll">
                        <label :for="'all' + index">Все удары</label>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="border border-slate-300">Интервал между ударами</td>
                <td class="border border-slate-300">
                    <input-number v-model="round.restBetweenPunchS" :id="'rest-between-punch' + index"/>
                </td>
            </tr>
            <tr>
                <td class="border border-slate-300">Отдых после раунда</td>
                <td class="border border-slate-300">
                    <input-number v-model="round.restBetweenRoundsS" :id="'rest-between-round' + index"/>
                </td>
            </tr>
            <tr>
                <td class="border border-slate-300">
                    <button @click="addRound(index)" class="w-full h-full bg-yellow-400 py-2 px-4 rounded">Добавить
                        раунд до
                    </button>
                </td>
                <td class="border border-slate-300">
                    <button @click="addRound(index, 'after')" class="w-full h-full bg-yellow-400 py-2 px-4 rounded">
                        Добавить раунд после
                    </button>
                </td>
            </tr>
            <tr>
                <td colspan="2" class="border border-slate-300">
                    <button @click="removeRound(index)" class="w-full h-full bg-yellow-400 py-2 px-4 rounded">
                        Удалить
                        раунд
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>

import InputNumber from "@/components/Form/InputNumber.vue";
import InputCheckbox from "@/components/Form/InputCheckbox.vue";
import useWorkout from "@/composables/workout.js";

const {
    workout,
    punches,
    addRound,
    removeRound
} = useWorkout();

</script>

<style scoped>

</style>