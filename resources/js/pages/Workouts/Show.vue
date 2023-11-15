<template>
    <template v-if="workouts.length > 0">
        <table class="border-collapse border border-slate-400">
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
                <td class="border border-slate-300">Время подготовки</td>
                <td class="border border-slate-300">
                    <input-number v-model="workout.prepareTimeS" :id="'prepare-time'"/>
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
                    <button class="w-full h-full bg-yellow-400 py-2 px-4 rounded" @click="start">Начать
                        тренировку
                        онлайн
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
        <template v-if="workout.params">
            <table v-if="!workout.isExpand" class="border-collapse border border-slate-400 mx-auto">
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
            <table v-else v-for="(round, index) in workout.params" :key="index"
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
                        <button @click="addRound(index)" class="w-full h-full bg-yellow-400 py-2 px-4 rounded">
                            Добавить
                            раунд до
                        </button>
                    </td>
                    <td class="border border-slate-300">
                        <button @click="addRound(index, 'after')"
                                class="w-full h-full bg-yellow-400 py-2 px-4 rounded">
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
        </template>
        <button class="bg-yellow-400 py-2 px-4 rounded" v-if="isWorkoutEdit" @click="workoutUpdate">Сохранить</button>
    </template>
    <template v-else>
        Тренировок пока нет...
    </template>
</template>

<script setup>
import InputNumber from "@/components/Form/InputNumber.vue";
import InputCheckbox from "@/components/Form/InputCheckbox.vue";
import useWorkout from "@/composables/workout.js";
import {onMounted, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();

const {
    voices,
    workout,
    workouts,
    punches,
    isWorkoutEdit,
    init,
    start,
    addRound,
    removeRound,
    changeMode,
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
