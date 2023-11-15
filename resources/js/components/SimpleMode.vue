<template>
    <div class="flex justify-center">
        <table class="border-collapse border border-slate-400">
            <tbody>
            <tr>
                <td class="border border-slate-300">Количество раундов</td>
                <td class="border border-slate-300">
                    <input-number v-model="workout.params.roundCount" :id="'round-count'"/>
                </td>
            </tr>
            <tr>
                <td class="border border-slate-300">Время раунда</td>
                <td class="border border-slate-300">
                    <input-number v-model="workout.params.roundTimeS" :id="'round-time'"/>
                </td>
            </tr>
            <tr>
                <td class="border border-slate-300">Количество ударов</td>
                <td class="border border-slate-300">
                    <input-number v-model="workout.params.punchCount" :id="'punch-count'"/>
                </td>
            </tr>
            <tr>
                <td class="border border-slate-300 ">Удары</td>
                <td class="border border-slate-300">
                    <div class="grid grid-cols-2 justify-items-center">
                        <template v-for="punch in punches" :key="punch">
                            <input-checkbox v-model="workout.params.checked" :punch="punch"/>
                        </template>
                    </div>
                    <div>
                        <input type="checkbox" id="all" v-model="workout.params.selectAll">
                        <label for="all">Все удары</label>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="border border-slate-300">Интервал между ударами</td>
                <td class="border border-slate-300">
                    <input-number v-model="workout.params.restBetweenPunchS" :id="'rest-between-punch'"/>
                </td>
            </tr>
            <tr>
                <td class="border border-slate-300">Отдых между раундами</td>
                <td class="border border-slate-300">
                    <input-number v-model="workout.params.restBetweenRoundsS" :id="'rest-between-round'"/>
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

const {workout, punches} = useWorkout()
</script>

<style scoped>

</style>