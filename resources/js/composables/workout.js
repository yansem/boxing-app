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
const roundCount = ref('');
let timerInterval;
const isPrepare = ref(false);
const isWork = ref(false);
const isRest = ref(false);

const simpleMode = {
    roundCount: 3,
    roundTimeM: 0,
    roundTimeS: 20,
    get roundTimeMs() {
        return (this.roundTimeM * 60 + this.roundTimeS) * 1000;
    },
    punchCount: 3,
    checked: [1, 2, 3, 4, 5, 6, 7, 8],
    get selectAll() {
        return this.checked.length === punches.length;
    },
    set selectAll(value) {
        this.checked = value ? [...punches] : [];
    },
    restBetweenPunchM: 0,
    restBetweenPunchS: 3,
    get restBetweenPunchMs() {
        return (this.restBetweenPunchM * 60 + this.restBetweenPunchS) * 1000;
    },
    restBetweenRoundsM: 0,
    restBetweenRoundsS: 10,
    get restBetweenRoundsMs() {
        return (this.restBetweenRoundsM * 60 + this.restBetweenRoundsS) * 1000;
    }
};

const expandMode = {
    roundTimeM: 0,
    roundTimeS: 20,
    get roundTimeMs() {
        return (this.roundTimeM * 60 + this.roundTimeS) * 1000;
    },
    punchCount: 3,
    restBetweenPunchM: 0,
    restBetweenPunchS: 3,
    get restBetweenPunchMs() {
        return (this.restBetweenPunchM * 60 + this.restBetweenPunchS) * 1000;
    },
    restBetweenRoundsM: 0,
    restBetweenRoundsS: 10,
    get restBetweenRoundsMs() {
        return (this.restBetweenRoundsM * 60 + this.restBetweenRoundsS) * 1000;
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
            const totalS = (workout.prepareTimeM * 60 + parseInt(workout.prepareTimeS))
                + (workout.params.roundCount * (workout.params.roundTimeM * 60 + workout.params.roundTimeS))
                + ((workout.params.roundCount - 1) * (workout.params.restBetweenRoundsM * 60 + workout.params.restBetweenRoundsS));
            return formatTime(totalS);
        } else {
            let totalS = workout.prepareTimeM * 60 + parseInt(workout.prepareTimeS);
            workout.params.forEach(round => {
                totalS += (round.roundTimeM * 60 + parseInt(round.roundTimeS)) + (round.restBetweenRoundsM * 60 + parseInt(round.restBetweenRoundsS));
            })
            totalS -= workout.params[workout.params.length - 1].restBetweenRoundsS;

            return formatTime(totalS);
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
    timer.value = formatTime(s);
    return setInterval(() => {
        s--;
        timer.value = formatTime(s);
    }, 1000);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function formatTime(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = seconds % 60;

    return `${padZero(h)}:${padZero(m)}:${padZero(s)}`;
}

function padZero(value) {
    return value < 10 ? `0${value}` : value;
}

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
                        return (workout.prepareTimeM * 60 + workout.prepareTimeS) * 1000;
                    }
                }
            }
        );
        if (!workout.isExpand) {
            Object.defineProperties(workout.params,
                {
                    roundTimeMs: {
                        get: function () {
                            return (workout.params.roundTimeM * 60 + workout.params.roundTimeS) * 1000;
                        }
                    },
                    restBetweenPunchMs: {
                        get: function () {
                            return (workout.params.restBetweenPunchM * 60 +workout.params.restBetweenPunchS) * 1000;
                        }
                    },
                    restBetweenRoundsMs: {
                        get: function () {
                            return (workout.params.restBetweenRoundsM * 60 +workout.params.restBetweenRoundsS) * 1000;
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
                                return (round.roundTimeM * 60 + round.roundTimeS) * 1000;
                            }
                        },
                        restBetweenPunchMs: {
                            get: function () {
                                 return (round.restBetweenPunchM * 60 + round.restBetweenPunchS) * 1000;
                            }
                        },
                        restBetweenRoundsMs: {
                            get: function () {
                                 return (round.restBetweenRoundsM * 60 + round.restBetweenRoundsS) * 1000;
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
            prepareTimeM: 0,
            prepareTimeS: 3,
            get prepareTimeMs() {
                return (this.prepareTimeM * 60 + this.prepareTimeS) * 1000;
            },
            params: copyObject(simpleMode),
        };
        await defineTotalTimeProp(workout.value);

        if (page === 'workouts.show') {
            if (workouts.value.length > 0) {
                isWorkoutEdit.value = false;
                const copiedWorkout = await _.cloneDeep(workouts.value.find(work => work.id == route.params.id));
                await defineWorkoutProps(copiedWorkout);
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
        console.log(workout.value);
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
        roundCount.value = `1/${workout.value.params.roundCount || workout.value.params.length}`;
        let debugPrepare = debug('prepare');
        timerInterval = timerCount(workout.value.prepareTimeMs)
        isPrepare.value = !isPrepare.value;
        await sleep(workout.value.prepareTimeMs);
        isPrepare.value = !isPrepare.value;
        clearInterval(debugPrepare);
        clearInterval(timerInterval);
        if (!workout.value.isExpand) {
            for (let round = 0; round < workout.value.params.roundCount; round++) {
                roundCount.value = `${round + 1}/${workout.value.params.roundCount}`;
                const debugRound = debug('round');
                timerInterval = timerCount(workout.value.params.roundTimeMs);
                isWork.value = !isWork.value;

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
                isWork.value = !isWork.value;

                playAudio(bell);

                if (round < workout.value.params.roundCount - 1) {
                    const debugRest = debug('rest');
                    timerInterval = timerCount(workout.value.params.restBetweenRoundsMs)
                    isRest.value = !isRest.value;
                    await sleep(workout.value.params.restBetweenRoundsMs);
                    isRest.value = !isRest.value;
                    clearInterval(debugRest);
                    clearInterval(timerInterval);
                }
            }
        } else {
            for (let round = 0; round < workout.value.params.length; round++) {
                roundCount.value = `${round + 1}/${workout.value.params.length}`;
                const debugRound = debug('round');
                timerInterval = timerCount(workout.value.params[round].roundTimeMs)
                isWork.value = !isWork.value;

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
                isWork.value = !isWork.value;

                playAudio(bell);

                if (round < workout.value.params.length - 1) {
                    const debugRest = debug('rest');
                    timerInterval = timerCount(workout.value.params[round].restBetweenRoundsMs)
                    isRest.value = !isRest.value;
                    await sleep(workout.value.params[round].restBetweenRoundsMs);
                    isRest.value = !isRest.value;
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
        roundCount,
        isPrepare,
        isWork,
        isRest,
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