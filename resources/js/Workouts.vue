<template>
    {{ workoutSelected }}
    <div class="flex">
        <aside class="w-64 bg-gray-500 p-4 h-screen">
            <button class="text-white text-2xl font-semibold mb-4">Добавить тренировку</button>
            <ul>
                <li v-for="workout in workouts" class="mb-2">
                    <button @click="workoutSelected = workout" class="text-white hover:text-yellow-400">{{ workout.title }}</button>
                </li>
            </ul>
        </aside>
        <div class="flex flex-col items-center flex-grow">
            <table class="border-collapse border border-slate-400">
                <tbody>
                <tr>
                    <td class="border border-slate-300">Расширенный режим</td>
                    <td class="border border-slate-300 text-center">
                        <input type="checkbox" id="expand" v-model="workoutSelected.isExpand">
                    </td>
                </tr>
                <tr>
                    <td class="border border-slate-300">Время подготовки</td>
                    <td class="border border-slate-300">
                        <input-number v-model="workoutSelected.prepareTimeS" :id="'prepare-time'"/>
                    </td>
                </tr>
                <tr>
                    <td class="border border-slate-300">Общее время тренировки</td>
                    <td class="border border-slate-300 text-center">
                        {{ totalTime }}
                    </td>
                </tr>
                <tr>
                    <td class="border border-slate-300">Выберите голос озвучки</td>
                    <td class="border border-slate-300 text-center">
                        <select v-model="workoutSelected.voiceSelected">
                            <option v-for="voice in voices" :value="voice">{{ voice.name }}</option>
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
            <table v-if="!workoutSelected.isExpand" class="border-collapse border border-slate-400 mx-auto">
                <tbody>
                <tr>
                    <td class="border border-slate-300">Количество раундов</td>
                    <td class="border border-slate-300">
                        <input-number v-model="roundCount" :id="'round-count'"/>
                    </td>
                </tr>
                <tr>
                    <td class="border border-slate-300">Время раунда</td>
                    <td class="border border-slate-300">
                        <input-number v-model="roundTimeS" :id="'round-time'"/>
                    </td>
                </tr>
                <tr>
                    <td class="border border-slate-300">Количество ударов</td>
                    <td class="border border-slate-300">
                        <input-number v-model="punchCount" :id="'punch-count'"/>
                    </td>
                </tr>
                <tr>
                    <td class="border border-slate-300 ">Удары</td>
                    <td class="border border-slate-300">
                        <div class="grid grid-cols-2 justify-items-center">
                            <template v-for="punch in punches" :key="punch">
                                <input-checkbox v-model="checked" :punch="punch"/>
                            </template>
                        </div>
                        <div>
                            <input type="checkbox" id="all" v-model="selectAll">
                            <label for="all">Все удары</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="border border-slate-300">Интервал между ударами</td>
                    <td class="border border-slate-300">
                        <input-number v-model="restBetweenPunchS" :id="'rest-between-punch'"/>
                    </td>
                </tr>
                <tr>
                    <td class="border border-slate-300">Отдых между раундами</td>
                    <td class="border border-slate-300">
                        <input-number v-model="restBetweenRoundsS" :id="'rest-between-round'"/>
                    </td>
                </tr>
                </tbody>
            </table>
            <table v-else v-for="(round, index) in rounds" :key="index" class="border-collapse border border-slate-400">
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
        </div>
    </div>
</template>

<script setup>
import InputNumber from "@/components/Form/InputNumber.vue";
import InputCheckbox from "@/components/Form/InputCheckbox.vue";

import {ref, computed, reactive, onMounted} from "vue";

const voices = ref([]);
const voiceSelected = ref(null);
let synth;

const speakText = async (punch) => {
    const utterance = new SpeechSynthesisUtterance(punch);
    utterance.voice = voiceSelected.value;
    utterance.rate = 3;
    utterance.onerror = function (event) {
        console.error('Speech synthesis error:', event.error);
    };
    await new Promise(function (resolve) {
        utterance.onend = resolve;
        synth.cancel();
        synth.speak(utterance);
    });
};

const getVoices = () => {
    if ('speechSynthesis' in window) {
        synth = window.speechSynthesis;
        synth.onvoiceschanged = () => {
            voices.value = synth.getVoices();
            voiceSelected.value = voices.value[0];

        };
    } else {
        alert('Speech Synthesis API is not supported in your browser.');
    }
};
onMounted(() => {
    getVoices();
})

const punches = [1, 2, 3, 4, 5, 6, 7, 8];

const checked = ref([1, 2, 3, 4, 5, 6, 7, 8]);

const workouts = [
    {
        id: 1,
        title: 'Новая тренировка 1',
        isExpand: false,
        prepareTimeS: 3,
        voiceSelected: null
    },
    {
        id: 2,
        title: 'Новая тренировка 2',
        isExpand: true,
        prepareTimeS: 4,
        voiceSelected: null
    },
    {
        id: 3,
        title: 'Новая тренировка 3',
        isExpand: false,
        prepareTimeS: 5,
        voiceSelected: null
    }
];

const workoutSelected = ref(workouts[0]);

const rounds = ref([
    reactive({
        roundTimeS: ref(20),
        get roundTimeMs() {
            return this.roundTimeS * 1000;
        },
        punchCount: ref(3),
        restBetweenPunchS: ref(3),
        get restBetweenPunchMs() {
            return this.restBetweenPunchS * 1000;
        },
        restBetweenRoundsS: ref(10),
        get restBetweenRoundsMs() {
            return this.restBetweenRoundsS * 1000;
        },
        checked: reactive([1, 2, 3, 4, 5, 6, 7, 8]),
        get selectAll() {
            return this.checked.length === punches.length;
        },
        set selectAll(value) {
            if (value) {
                this.checked = [...punches];
            } else {
                this.checked = [];
            }
        }
    })
]);

const bell = new Audio('/storage/sounds/bell.wav');

const selectAll = computed({
    get() {
        return checked.value.length === punches.length;
    },
    set(value) {
        if (value) {
            checked.value = [...punches];
        } else {
            checked.value = [];
        }
    }
})

const isExpand = ref(false);


const roundCount = ref(3);
const roundTimeS = ref(20);
const roundTimeMs = computed(() => roundTimeS.value * 1000);
const punchCount = ref(3);
const restBetweenPunchS = ref(3);
const restBetweenPunchMs = computed(() => restBetweenPunchS.value * 1000);
const restBetweenRoundsS = ref(10);
const restBetweenRoundsMs = computed(() => restBetweenRoundsS.value * 1000);
const prepareTimeS = ref(3);
const prepareTimeMs = computed(() => prepareTimeS.value * 1000);
const totalTime = computed(() => {
    return roundCount.value * roundTimeS.value + (roundCount.value - 1) * restBetweenRoundsS.value;
});

const debug = (msg = 'debug') => {
    let s = 1;
    console.log(msg);
    return setInterval(() => {
        console.log(s);
        s++;
    }, 1000);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const playAudio = (audio) => {
    return new Promise(resolve => {
        audio.play();
        audio.onended = resolve;
    })
}

const playRandomPunch = async (roundChecked = null) => {
    if (roundChecked) {
        const punchIndex = Math.floor(Math.random() * roundChecked.length);
        // const punchAudio = new Audio('/storage/sounds/' + roundChecked[punchIndex] + '.mp3');
        speakText(roundChecked[punchIndex]);
        // await playAudio(punchAudio);
    } else {
        const punchIndex = Math.floor(Math.random() * checked.value.length);
        // const punchAudio = new Audio('/storage/sounds/' + checked.value[punchIndex] + '.mp3');
        await speakText(checked.value[punchIndex]);
        // await playAudio(punchAudio);
    }
}

const calcSleep = async (end, ms) => {
    if (Date.now() + ms < end) {
        await sleep(ms);
    } else {
        await sleep(end - Date.now());
    }
}

const download = async () => {
    console.log('download');
}

const start = async () => {
    let debugPrepare = debug('prepare');
    await sleep(prepareTimeMs.value);
    clearInterval(debugPrepare);
    if (!workoutSelected.isExpand.value) {
        for (let round = 0; round < workoutSelected.roundCount.value; round++) {

            const start = Date.now();
            const end = start + roundTimeMs.value;

            const debugRound = debug('round');

            await playAudio(bell);

            let p = 0;
            while (Date.now() < start + roundTimeMs.value) {
                await playRandomPunch();
                p++;
                if (p === punchCount.value) {
                    p = 0;
                    await calcSleep(end, restBetweenPunchMs.value)
                } else {
                    await calcSleep(end, 100)
                }
            }

            clearInterval(debugRound);

            playAudio(bell);

            if (round < roundCount.value - 1) {
                const debugRest = debug('rest');
                await sleep(restBetweenRoundsMs.value);
                clearInterval(debugRest);
            }
        }
    } else {
        for (let round = 0; round < rounds.value.length; round++) {
            const debugRound = debug('round');

            const start = Date.now();
            const end = start + rounds.value[round].roundTimeMs;

            await playAudio(bell);

            let p = 0;
            while (Date.now() < start + rounds.value[round].roundTimeMs) {
                await playRandomPunch(rounds.value[round].checked);
                p++;
                if (p === rounds.value[round].punchCount) {
                    p = 0;
                    await calcSleep(end, rounds.value[round].restBetweenPunchMs);
                } else {
                    await calcSleep(end, 1000);
                }
            }

            clearInterval(debugRound);

            playAudio(bell);

            if (round < rounds.value.length - 1) {
                const debugRest = debug('rest');
                await sleep(rounds.value[round].restBetweenRoundsMs);
                clearInterval(debugRest);
            }
        }
    }
}

const addRound = (index, order = '') => {
    rounds.value.splice((order === 'after' ? index + 1 : index), 0,
        reactive({
            roundTimeS: ref(20),
            get roundTimeMs() {
                return this.roundTimeS * 1000;
            },
            punchCount: ref(3),
            restBetweenPunchS: ref(3),
            get restBetweenPunchMs() {
                return this.restBetweenPunchS * 1000;
            },
            restBetweenRoundsS: ref(10),
            get restBetweenRoundsMs() {
                return this.restBetweenRoundsS * 1000;
            },
            checked: reactive([1, 2, 3, 4, 5, 6, 7, 8]),
            get selectAll() {
                return this.checked.length === punches.length;
            },
            set selectAll(value) {
                if (value) {
                    this.checked = [...punches];
                } else {
                    this.checked = [];
                }
            }
        })
    );
}

const removeRound = (index) => {
    rounds.value.splice(index, 1);
}

</script>
