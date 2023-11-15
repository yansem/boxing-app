import {computed, reactive, ref, watch} from "vue";
import _ from "lodash";
import {useRoute, useRouter} from "vue-router";

let synth;
const bell = new Audio('/storage/sounds/bell.wav');
const voices = ref([]);
const punches = [1, 2, 3, 4, 5, 6, 7, 8];
const workout = ref({});
const workouts = ref([]);
const isWorkoutEdit = ref(false);
const isWorkoutStart = ref(false);
const timer = ref('');
let timerInterval;

const simpleMode = {
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
};

const expandMode = {
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
};

const copyObject = (obj) => {
    return Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));
}

const defineTotalTimeProp = (workout) => {
    workout.totalTime = computed(() => {
        if (!workout.isExpand) {
            return workout.params.roundCount * workout.params.roundTimeS + (workout.params.roundCount - 1) * workout.params.restBetweenRoundsS;
        } else {
            let total = 0;
            workout.params.forEach(round => {
                total += parseInt(round.roundTimeS) + parseInt(round.restBetweenRoundsS);
            })
            total -= workout.params[workout.params.length - 1].restBetweenRoundsS;

            return isNaN(total) ? 0 : total;
        }
    });
}

const speakText = async (punch) => {
    const utterance = new SpeechSynthesisUtterance(punch);
    utterance.voice = voices.value.find((voice) => voice.voiceURI === workout.value.voiceSelected);
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

const timerCount = (ms) => {
    let s = ms / 1000;
    timer.value = s;
    return setInterval(() => {
        s--;
        timer.value = s;
    }, 1000);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const playAudio = (audio) => {
    return new Promise(resolve => {
        audio.play();
        audio.onended = resolve;
    })
}

const playRandomPunch = (roundChecked = null) => {
    if (roundChecked) {
        const punchIndex = Math.floor(Math.random() * roundChecked.length);
        speakText(roundChecked[punchIndex]);
    } else {
        const punchIndex = Math.floor(Math.random() * workout.value.params.checked.length);
        speakText(workout.value.params.checked[punchIndex]);
    }
}

const calcSleep = async (end, ms) => {
    if (Date.now() + ms < end) {
        await sleep(ms);
    } else {
        await sleep(end - Date.now());
    }
}

const defineWorkoutProps = (workout) => {
    if (!workout.prepareTimeMs) {
        Object.defineProperties(workout,
            {
                prepareTimeMs: {
                    get: function () {
                        return workout.prepareTimeS * 1000;
                    }
                }
            }
        );
        if (!workout.isExpand) {
            Object.defineProperties(workout.params,
                {
                    roundTimeMs: {
                        get: function () {
                            return workout.params.roundTimeS * 1000;
                        }
                    },
                    restBetweenPunchMs: {
                        get: function () {
                            return workout.params.restBetweenPunchS * 1000;
                        }
                    },
                    restBetweenRoundsMs: {
                        get: function () {
                            return workout.params.restBetweenRoundsS * 1000;
                        }
                    },
                    selectAll: {
                        get: function () {
                            return this.checked.length === punches.length;
                        },
                        set: function (value) {
                            this.checked = value ? [...punches] : [];
                        }
                    }
                }
            );
        } else {
            workout.params.forEach(round => {
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
                                return this.checked.length === punches.length;
                            },
                            set: function (value) {
                                this.checked = value ? [...punches] : [];
                            }
                        }
                    }
                );
            })
        }
        defineTotalTimeProp(workout);
    }
}

export default function useWorkout(page = null) {
    const router = useRouter();
    const route = useRoute();
    const init = async () => {
        workout.value = {
            title: 'Пробная тренировка',
            voiceSelected: 'Microsoft Irina - Russian (Russia)',
            isExpand: false,
            prepareTimeS: 3,
            get prepareTimeMs() {
                return this.prepareTimeS * 1000;
            },
            params: copyObject(simpleMode),
        };
        defineTotalTimeProp(workout.value);


        if (page === 'workouts.show') {
            if (workouts.value.length > 0) {
                isWorkoutEdit.value = false;
                const copiedWorkout = _.cloneDeep(workouts.value.find(work => work.id == route.params.id));
                defineWorkoutProps(copiedWorkout);
                workout.value = copiedWorkout;
                watch(workout.value, (newVal, oldVal) => {
                        if (newVal && oldVal) {
                            isWorkoutEdit.value = true
                        }
                    },
                    {deep: true, immediate: true})
            }
        } else if (page === 'workouts.create') {
            workout.value.title = workouts.value.length > 0
                ? 'Новая тренировка ' + (workouts.value.length + 1)
                : 'Новая тренировка 1'
        }
    };

    const getWorkouts = async () => {
        await axios.get('/api/workouts')
            .then(response => {
                workouts.value = response.data.data
            })
            .catch(error => {

            })
    };

    const getVoices = async () => {
        if ('speechSynthesis' in window) {
            synth = window.speechSynthesis;
            synth.onvoiceschanged = () => {
                voices.value = synth.getVoices();
                workout.value.voiceSelected = voices.value[0].voiceURI;

            };
        } else {
            alert('Speech Synthesis API is not supported in your browser.');
        }
    };

    const start = async () => {
        isWorkoutStart.value = true;
        let debugPrepare = debug('prepare');
        timerInterval = timerCount(workout.value.prepareTimeMs)
        await sleep(workout.value.prepareTimeMs);
        clearInterval(debugPrepare);
        clearInterval(timerInterval);
        if (!workout.value.isExpand) {
            for (let round = 0; round < workout.value.params.roundCount; round++) {
                const debugRound = debug('round');
                timerInterval = timerCount(workout.value.params.roundTimeMs)

                const start = Date.now();
                const end = start + workout.value.params.roundTimeMs;

                await playAudio(bell);

                let p = 0;
                while (Date.now() < start + workout.value.params.roundTimeMs) {
                    await playRandomPunch();
                    p++;
                    if (p === workout.value.params.punchCount) {
                        p = 0;
                        await calcSleep(end, workout.value.params.restBetweenPunchMs)
                    } else {
                        await calcSleep(end, 1000)
                    }
                }

                clearInterval(debugRound);
                clearInterval(timerInterval);

                playAudio(bell);

                if (round < workout.value.params.roundCount - 1) {
                    const debugRest = debug('rest');
                    timerInterval = timerCount(workout.value.params.restBetweenRoundsMs)
                    await sleep(workout.value.params.restBetweenRoundsMs);
                    clearInterval(debugRest);
                    clearInterval(timerInterval);
                }
            }
        } else {
            for (let round = 0; round < workout.value.params.length; round++) {
                const debugRound = debug('round');
                timerInterval = timerCount(workout.value.params[round].roundTimeMs)

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
                clearInterval(timerInterval);

                playAudio(bell);

                if (round < workout.value.params.length - 1) {
                    const debugRest = debug('rest');
                    timerInterval = timerCount(workout.value.params[round].restBetweenRoundsMs)
                    await sleep(workout.value.params[round].restBetweenRoundsMs);
                    clearInterval(debugRest);
                    clearInterval(timerInterval);
                }
            }
        }
        isWorkoutStart.value = false;
    };

    const addRound = (index, order = '') => {
        workout.value.params.splice((order === 'after' ? index + 1 : index), 0, copyObject(expandMode));
    };

    const removeRound = (index) => {
        workout.value.params.splice(index, 1);
    };

    const changeMode = async () => {
        workout.value.isExpand = !workout.value.isExpand;
        workout.value.params = workout.value.isExpand ? [copyObject(expandMode)] : copyObject(simpleMode);
    };

    const workoutStore = async () => {
        await axios.post('/api/workouts', workout.value)
            .then(async response => {
                await getWorkouts();
            })
            .catch(error => {

            })

        await router.push({name: 'workouts.show', params: {id: workouts.value[workouts.value.length - 1].id}})
    };

    const workoutUpdate = async () => {
        await axios.patch(`/api/workouts/${workout.value.id}`, workout.value)
            .then(async response => {
                await getWorkouts();
            })
            .catch(error => {

            })
        isWorkoutEdit.value = false;
    }

    const workoutDelete = async () => {
        await axios.delete(`/api/workouts/${workout.value.id}`)
            .then(async response => {
                await getWorkouts();
                await router.push({name: 'workouts.show', params: {id: workouts.value[workouts.value.length - 1].id}})
            })
            .catch(error => {

            })
    }

    return {
        voices,
        workout,
        workouts,
        punches,
        isWorkoutEdit,
        isWorkoutStart,
        timer,
        init,
        getWorkouts,
        getVoices,
        start,
        addRound,
        removeRound,
        changeMode,
        workoutStore,
        workoutUpdate,
        workoutDelete
    }
}