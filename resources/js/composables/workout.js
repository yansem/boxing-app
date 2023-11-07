import {computed, reactive, ref} from "vue";

const bell = new Audio('/storage/sounds/bell.wav');
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

const punches = [1, 2, 3, 4, 5, 6, 7, 8];
const workouts = ref([]);
const workoutSelected = ref(null);

const simpleMode = reactive({
    roundCount: 3,
    roundTimeS: 20,
    get roundTimeMs() {
        return this.roundTimeS * 1000;
    },
    punchCount: 3,
    checked: [1, 2, 3, 4, 5, 6, 7, 8],
    get selectAll() {
        return this.checked.length === punches.length;
    },
    set selectAll(value) {
        if (value) {
            this.checked = [...punches];
        } else {
            this.checked = [];
        }
    },
    restBetweenPunchS: 3,
    get restBetweenPunchMs() {
        return this.restBetweenPunchS * 1000;
    },
    restBetweenRoundsS: 10,
    get restBetweenRoundsMs() {
        return this.restBetweenRoundsS * 1000;
    }
});

const expandMode = ref([
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

const isExpand = ref(false);

const prepareTimeS = ref(3);
const prepareTimeMs = computed(() => prepareTimeS.value * 1000);
const totalTime = computed(() => {
    if (!isExpand.value) {
        return simpleMode.roundCount * simpleMode.roundTimeS + (simpleMode.roundCount - 1) * simpleMode.restBetweenRoundsS;
    } else {
        let total = 0;
        expandMode.value.forEach(round => {
            total += parseInt(round.roundTimeS) + parseInt(round.restBetweenRoundsS);
        })
        total -= expandMode.value[expandMode.value.length - 1].restBetweenRoundsS;

        return isNaN(total) ? 0 : total;
    }
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
        const punchIndex = Math.floor(Math.random() * simpleMode.checked.length);
        // const punchAudio = new Audio('/storage/sounds/' + checked.value[punchIndex] + '.mp3');
        await speakText(simpleMode.checked[punchIndex]);
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

export default function useWorkout() {
    const getWorkouts = () => {
        workouts.value = [
            {
                id: 1,
                title: 'Новая тренировка 1',
                isExpand: false,
                prepareTimeS: 3,
                totalTime: 80,
                simpleMode: reactive({
                    roundCount: 3,
                    roundTimeS: 20,
                    get roundTimeMs() {
                        return this.roundTimeS * 1000;
                    },
                    punchCount: 3,
                    checked: [1, 2, 3, 4, 5, 6, 7, 8],
                    get selectAll() {
                        return this.checked.length === punches.length;
                    },
                    set selectAll(value) {
                        if (value) {
                            this.checked = [...punches];
                        } else {
                            this.checked = [];
                        }
                    },
                    restBetweenPunchS: 3,
                    get restBetweenPunchMs() {
                        return this.restBetweenPunchS * 1000;
                    },
                    restBetweenRoundsS: 10,
                    get restBetweenRoundsMs() {
                        return this.restBetweenRoundsS * 1000;
                    }
                }),
                voiceSelected: null,
                roundCount: 3,
                roundTimeS: 20,
                punchCount: 3,
                checked: [1, 2, 3],
                restBetweenPunchS: 3,
                restBetweenRoundsS: 10
            },
            {
                id: 1,
                title: 'Новая тренировка 2',
                isExpand: true,
                prepareTimeS: 3,
                totalTime: 80,
                voiceSelected: null,
                rounds: [
                    {
                        roundTimeS: 20,
                        punchCount: 3,
                        checked: [1, 2, 3],
                        restBetweenPunchS: 3,
                        restBetweenRoundsS: 10
                    },
                    {
                        roundTimeS: 20,
                        punchCount: 3,
                        checked: [4, 5, 6],
                        restBetweenPunchS: 3,
                        restBetweenRoundsS: 10
                    }
                ],
                roundTimeS: 20,
                punchCount: 3,
                checked: [4, 5, 6],
                restBetweenPunchS: 3,
                restBetweenRoundsS: 10
            },
            {
                id: 1,
                title: 'Новая тренировка 3',
                isExpand: false,
                prepareTimeS: 3,
                totalTime: 80,
                voiceSelected: null,
                roundCount: 3,
                roundTimeS: 20,
                punchCount: 3,
                checked: [7, 8],
                restBetweenPunchS: 3,
                restBetweenRoundsS: 10
            }
        ];
        workoutSelected.value = {...workouts[0]}
    }
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

    const start = async () => {
        let debugPrepare = debug('prepare');
        await sleep(prepareTimeMs.value);
        clearInterval(debugPrepare);
        if (!isExpand.value) {
            for (let round = 0; round < simpleMode.roundCount; round++) {

                const start = Date.now();
                const end = start + simpleMode.roundTimeMs;

                const debugRound = debug('round');

                await playAudio(bell);

                let p = 0;
                while (Date.now() < start + simpleMode.roundTimeMs) {
                    await playRandomPunch();
                    p++;
                    if (p === simpleMode.punchCount) {
                        p = 0;
                        await calcSleep(end, simpleMode.restBetweenPunchMs)
                    } else {
                        await calcSleep(end, 100)
                    }
                }

                clearInterval(debugRound);

                playAudio(bell);

                if (round < simpleMode.roundCount - 1) {
                    const debugRest = debug('rest');
                    await sleep(simpleMode.restBetweenRoundsMs);
                    clearInterval(debugRest);
                }
            }
        } else {
            for (let round = 0; round < expandMode.value.length; round++) {
                const debugRound = debug('round');

                const start = Date.now();
                const end = start + expandMode.value[round].roundTimeMs;

                await playAudio(bell);

                let p = 0;
                while (Date.now() < start + expandMode.value[round].roundTimeMs) {
                    await playRandomPunch(expandMode.value[round].checked);
                    p++;
                    if (p === expandMode.value[round].punchCount) {
                        p = 0;
                        await calcSleep(end, expandMode.value[round].restBetweenPunchMs);
                    } else {
                        await calcSleep(end, 1000);
                    }
                }

                clearInterval(debugRound);

                playAudio(bell);

                if (round < expandMode.value.length - 1) {
                    const debugRest = debug('rest');
                    await sleep(expandMode.value[round].restBetweenRoundsMs);
                    clearInterval(debugRest);
                }
            }
        }
    };

    const addRound = (index, order = '') => {
        expandMode.value.splice((order === 'after' ? index + 1 : index), 0,
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
    };

    const removeRound = (index) => {
        expandMode.value.splice(index, 1);
    };

    return {
        workouts,
        punches,
        isExpand,
        simpleMode,
        expandMode,
        prepareTimeS,
        totalTime,
        voices,
        voiceSelected,
        getWorkouts,
        getVoices,
        start,
        addRound,
        removeRound
    }
}