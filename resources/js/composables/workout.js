import {computed, reactive, ref, toRefs} from "vue";

let synth;
const bell = new Audio('/storage/sounds/bell.wav');
const punches = [1, 2, 3, 4, 5, 6, 7, 8];
const workouts = ref([]);

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
        this.checked = value ? [...punches] : [];
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

const expandMode = [
    reactive({
        roundTimeS: 20,
        get roundTimeMs() {
            return this.roundTimeS * 1000;
        },
        punchCount: 3,
        restBetweenPunchS: 3,
        get restBetweenPunchMs() {
            return this.restBetweenPunchS * 1000;
        },
        restBetweenRoundsS: 10,
        get restBetweenRoundsMs() {
            return this.restBetweenRoundsS * 1000;
        },
        checked: [1, 2, 3, 4, 5, 6, 7, 8],
        get selectAll() {
            return this.checked.length === punches.length;
        },
        set selectAll(value) {
            this.checked = value ? [...punches] : [];
        }
    })
];

const workout = ref({
    voices: [],
    voiceSelected: null,
    isExpand: false,
    prepareTimeS: 3,
    get prepareTimeMs() {
        return this.prepareTimeS * 1000;
    },
    params: {...toRefs(simpleMode)}
    // params: {
    //     roundCount: 3,
    //     roundTimeS: 20,
    //     get roundTimeMs() {
    //         return this.roundTimeS * 1000;
    //     },
    //     punchCount: 3,
    //     checked: [1, 2, 3, 4, 5, 6, 7, 8],
    //     get selectAll() {
    //         return this.checked.length === punches.length;
    //     },
    //     set selectAll(value) {
    //         this.checked = value ? [...punches] : [];
    //     },
    //     restBetweenPunchS: 3,
    //     get restBetweenPunchMs() {
    //         return this.restBetweenPunchS * 1000;
    //     },
    //     restBetweenRoundsS: 10,
    //     get restBetweenRoundsMs() {
    //         return this.restBetweenRoundsS * 1000;
    //     }
    // }
});

workout.value.totalTime = computed(() => {
    if (!workout.value.isExpand) {
        return workout.value.params.roundCount * workout.value.params.roundTimeS + (workout.value.params.roundCount - 1) * workout.value.params.restBetweenRoundsS;
    } else {
        let total = 0;
        workout.value.params.forEach(round => {
            total += parseInt(round.roundTimeS) + parseInt(round.restBetweenRoundsS);
        })
        total -= workout.value.params[workout.value.params.length - 1].restBetweenRoundsS;

        return isNaN(total) ? 0 : total;
    }
});

const speakText = async (punch) => {
    const utterance = new SpeechSynthesisUtterance(punch);
    utterance.voice = workout.value.voiceSelected;
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
        const punchIndex = Math.floor(Math.random() * workout.value.params.checked.length);
        // const punchAudio = new Audio('/storage/sounds/' + checked.value[punchIndex] + '.mp3');
        await speakText(workout.value.params.checked[punchIndex]);
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
                voiceSelected: null,
                params: {
                    roundCount: 3,
                    roundTimeS: 20,
                    punchCount: 3,
                    checked: [1, 2, 3, 4, 5, 6, 7, 8],
                    restBetweenPunchS: 3,
                    restBetweenRoundsS: 10
                }
            },
            {
                id: 2,
                title: 'Новая тренировка 2',
                isExpand: true,
                prepareTimeS: 3,
                voiceSelected: null,
                params: [
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
                        checked: [4, 5, 6, 7, 8],
                        restBetweenPunchS: 3,
                        restBetweenRoundsS: 10
                    },
                ]
            }
        ];
        // get roundTimeMs() {
        //     return this.roundTimeS * 1000;
        // },
        // get selectAll() {
        //     return this.checked.length === punches.length;
        // },
        // set selectAll(value) {
        //     if (value) {
        //         this.checked = [...punches];
        //     } else {
        //         this.checked = [];
        //     }
        // },
        // get restBetweenPunchMs() {
        //     return this.restBetweenPunchS * 1000;
        // },
        // get restBetweenRoundsMs() {
        //     return this.restBetweenRoundsS * 1000;
        // }
        Object.defineProperties(workouts.value[0],
            {
                prepareTimeMs: {
                    get: function () {
                        return workouts.value[0].prepareTimeS * 1000;
                    }
                }
            }
        );
        if (!workouts.value[0].isExpand) {
            Object.defineProperties(workouts.value[0].params,
                {
                    roundTimeMs: {
                        get: function () {
                            return workouts.value[0].params.roundTimeS * 1000;
                        }
                    },
                    restBetweenPunchMs: {
                        get: function () {
                            return workouts.value[0].params.restBetweenPunchS * 1000;
                        }
                    },
                    restBetweenRoundsMs: {
                        get: function () {
                            return workouts.value[0].params.restBetweenRoundsS * 1000;
                        }
                    },
                    selectAll: {
                        get: function () {
                            return workouts.value[0].params.restBetweenRoundsS * 1000;
                        },
                        set: function (value) {
                            this.checked = value ? [...punches] : [];
                        }
                    }
                }
            );
        } else {
            workouts.value[0].params.forEach(round => {
                Object.defineProperties(round,
                    {
                        roundTimeMs: {
                            get: function () {
                                return round.roundTimeS * 1000;
                            }
                        },
                        restBetweenPunchMs: {
                            get: function () {
                                return round.restBetweenPunchS * 1000;
                            }
                        },
                        restBetweenRoundsMs: {
                            get: function () {
                                return round.restBetweenRoundsS * 1000;
                            }
                        },
                        selectAll: {
                            get: function () {
                                return round.restBetweenRoundsS * 1000;
                            }
                        }
                    }
                );
            })
        }


        workout.value = workouts.value[0]
    }
    const getVoices = () => {
        if ('speechSynthesis' in window) {
            synth = window.speechSynthesis;
            synth.onvoiceschanged = () => {
                workout.value.voices = synth.getVoices();
                workout.value.voiceSelected = workout.value.voices[0];

            };
        } else {
            alert('Speech Synthesis API is not supported in your browser.');
        }
    };

    const start = async () => {
        let debugPrepare = debug('prepare');
        await sleep(workout.value.prepareTimeMs);
        clearInterval(debugPrepare);
        if (!workout.value.isExpand) {
            for (let round = 0; round < workout.value.params.roundCount; round++) {

                const start = Date.now();
                const end = start + workout.value.params.roundTimeMs;

                const debugRound = debug('round');

                await playAudio(bell);

                let p = 0;
                while (Date.now() < start + workout.value.params.roundTimeMs) {
                    await playRandomPunch();
                    p++;
                    if (p === workout.value.params.punchCount) {
                        p = 0;
                        await calcSleep(end, workout.value.params.restBetweenPunchMs)
                    } else {
                        await calcSleep(end, 100)
                    }
                }

                clearInterval(debugRound);

                playAudio(bell);

                if (round < workout.value.params.roundCount - 1) {
                    const debugRest = debug('rest');
                    await sleep(workout.value.params.restBetweenRoundsMs);
                    clearInterval(debugRest);
                }
            }
        } else {
            for (let round = 0; round < workout.value.params.length; round++) {
                const debugRound = debug('round');

                const start = Date.now();
                const end = start + workout.value.params[round].roundTimeMs;

                await playAudio(bell);

                let p = 0;
                while (Date.now() < start + workout.value.params[round].roundTimeMs) {
                    await playRandomPunch(workout.value.params[round].checked);
                    p++;
                    if (p === workout.value.params[round].punchCount) {
                        p = 0;
                        await calcSleep(end, workout.value.params[round].restBetweenPunchMs);
                    } else {
                        await calcSleep(end, 1000);
                    }
                }

                clearInterval(debugRound);

                playAudio(bell);

                if (round < workout.value.params.length - 1) {
                    const debugRest = debug('rest');
                    await sleep(workout.value.params[round].restBetweenRoundsMs);
                    clearInterval(debugRest);
                }
            }
        }
    };

    const addRound = (index, order = '') => {
        workout.value.params.splice((order === 'after' ? index + 1 : index), 0,
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
                    this.checked = value ? [...punches] : [];
                }
            })
        );
    };

    const removeRound = (index) => {
        workout.value.params.splice(index, 1);
    };

    const changeMode = () => {
        workout.value.isExpand = !workout.value.isExpand;
        workout.value.params = workout.value.isExpand ? expandMode.map(obj => ({...toRefs(obj)})) : {...toRefs(simpleMode)};
    };

    const changeWorkout = (work) => {
        workout.value = {...work}
        Object.defineProperties(workout.value,
            {
                prepareTimeMs: {
                    get: function () {
                        return workout.value.prepareTimeS * 1000;
                    }
                }
            }
        );
        if (!workout.value.isExpand) {
            Object.defineProperties(workout.value.params,
                {
                    roundTimeMs: {
                        get: function () {
                            return workout.value.params.roundTimeS * 1000;
                        }
                    },
                    restBetweenPunchMs: {
                        get: function () {
                            return workout.value.params.restBetweenPunchS * 1000;
                        }
                    },
                    restBetweenRoundsMs: {
                        get: function () {
                            return workout.value.params.restBetweenRoundsS * 1000;
                        }
                    },
                    selectAll: {
                        get: function () {
                            return workout.value.params.restBetweenRoundsS * 1000;
                        }
                    }
                }
            );
        } else {
            workout.value.params.forEach(round => {
                Object.defineProperties(round,
                    {
                        roundTimeMs: {
                            get: function () {
                                return round.roundTimeS * 1000;
                            }
                        },
                        restBetweenPunchMs: {
                            get: function () {
                                return round.restBetweenPunchS * 1000;
                            }
                        },
                        restBetweenRoundsMs: {
                            get: function () {
                                return round.restBetweenRoundsS * 1000;
                            }
                        },
                        selectAll: {
                            get: function () {
                                return round.restBetweenRoundsS * 1000;
                            }
                        }
                    }
                );
            })
        }
    }

    return {
        workout,
        workouts,
        punches,
        getWorkouts,
        getVoices,
        start,
        addRound,
        removeRound,
        changeMode,
        changeWorkout
    }
}