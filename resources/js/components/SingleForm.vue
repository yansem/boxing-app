<template>
    <div class="flex justify-center">
        <table class="border-collapse border border-slate-400">
            <tbody>
            <tr>
                <td class="border border-slate-300">Расширенный режим</td>
                <td class="border border-slate-300 text-center">
                    <input type="checkbox" id="expand" v-model="isExpand">
                </td>
            </tr>
            <tr>
                <td class="border border-slate-300">Время подготовки</td>
                <td class="border border-slate-300">
                    <input-number v-model="prepareTimeS" :id="'prepare-time'"/>
                </td>
            </tr>
            <tr>
                <td class="border border-slate-300">Общее время тренировки</td>
                <td class="border border-slate-300 text-center">
                    {{ totalTime }}
                </td>
            </tr>
            <tr>
                <td colspan="2" class="border border-slate-300">
                    <button class="w-full h-full bg-yellow-400 py-2 px-4 rounded" @click="start">Начать тренировку
                        онлайн
                    </button>
                </td>
            </tr>
            <tr>
                <td colspan="2" class="border border-slate-300">
                    <button class="w-full bg-yellow-400 py-2 px-4 rounded">Скачать mp3</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <hr class="w-full mb-2">
    <div class="flex justify-center">
        <table class="border-collapse border border-slate-400">
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
                    <input-number v-model="restBetweenRoundS" :id="'rest-between-round'"/>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import InputNumber from "@/components/Form/InputNumber.vue";
import InputCheckbox from "@/components/Form/InputCheckbox.vue";
import {ref, computed} from "vue";

const punches = ref([1, 2, 3, 4, 5, 6, 7, 8]);

const checked = ref([1, 2, 3, 4, 5, 6, 7, 8]);

const rounds = ref([]);

const bell = new Audio('/sounds/bell.wav');

const selectAll = computed({
    get() {
        return checked.value.length === punches.value.length;
    },
    set(value) {
        if (value) {
            checked.value = [...punches.value];
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
const restBetweenRoundS = ref(10);
const restBetweenRoundMs = computed(() => restBetweenRoundS.value * 1000);
const prepareTimeS = ref(3);
const prepareTimeMs = computed(() => prepareTimeS.value * 1000);
const totalTime = computed(() => {
    return roundCount.value * roundTimeS.value + (roundCount.value - 1) * restBetweenRoundS.value;
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

const randomPunch = async () => {
    const punchIndex = Math.floor(Math.random() * checked.value.length);
    const punchAudio = new Audio('/sounds/' + checked.value[punchIndex] + '.mp3');
    await playAudio(punchAudio);
}

const calcSleep = async (end, ms) => {
    if (Date.now() + ms < end) {
        await sleep(ms);
    } else {
        await sleep(end - Date.now());
    }
}


const start = async () => {
    let debugPrepare = debug('prepare');
    await sleep(prepareTimeMs.value);
    clearInterval(debugPrepare);

    for (let round = 0; round < roundCount.value; round++) {
        const start = Date.now();
        const end = Date.now() + roundTimeMs.value;

        const debugRound = debug('round');

        await playAudio(bell);

        let p = 0;
        while (Date.now() < start + roundTimeMs.value) {
            await randomPunch();
            p++;
            if (p === punchCount.value) {
                p = 0;
                await calcSleep(end, restBetweenPunchMs.value)
            } else {
                await calcSleep(end, 1000)
            }
        }

        clearInterval(debugRound);

        playAudio(bell);

        if (round < roundCount.value - 1) {
            const debugRest = debug('rest');
            await sleep(restBetweenRoundMs.value);
            clearInterval(debugRest);
        }
    }
}
</script>
