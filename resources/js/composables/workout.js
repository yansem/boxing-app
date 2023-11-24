import {computed, reactive, ref, watch, watchEffect} from "vue";
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
const isPaused = ref(false);
let isResumed;

let end;
let p = 0;
let r = 0;
let s = 0;
let currentStageTimer;

const defineWorkoutModeProps = (params) => {
    Object.defineProperties(params,
        {
            roundTimeMs: {
                get: function () {
                    return (this.roundTimeM * 60 + this.roundTimeS) * 1000;
                }
            },
            restBetweenPunchMs: {
                get: function () {
                    return (this.restBetweenPunchM * 60 + this.restBetweenPunchS) * 1000;
                }
            },
            restBetweenRoundsMs: {
                get: function () {
                    return (this.restBetweenRoundsM * 60 + this.restBetweenRoundsS) * 1000;
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
}

const simpleMode = reactive({
    roundCount: 3,
    roundTimeM: 0,
    roundTimeS: 5,
    punchCount: 3,
    restBetweenPunchM: 0,
    restBetweenPunchS: 3,
    restBetweenRoundsM: 0,
    restBetweenRoundsS: 5,
    checked: [1, 2, 3, 4, 5, 6, 7, 8]
});

const expandMode = reactive({
    roundTimeM: 0,
    roundTimeS: 20,
    punchCount: 3,
    restBetweenPunchM: 0,
    restBetweenPunchS: 3,
    restBetweenRoundsM: 0,
    restBetweenRoundsS: 10,
    checked: [1, 2, 3, 4, 5, 6, 7, 8]
});

defineWorkoutModeProps(simpleMode);
defineWorkoutModeProps(expandMode);


const copyObject = (obj) => {
    return Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));
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
    s = ms / 1000;
    timer.value = formatTime(s);
    return setInterval(() => {
        if (!isPaused.value) {
            s--;
            timer.value = formatTime(s);
        }
    }, 1000);
}

const sleep = (ms) => new Promise(resolve => {
    let count = 0;
    const sleepInterval = setInterval(() => {
        count += 100;
        if (count > ms || isPaused.value) {
            clearInterval(sleepInterval);
            resolve();
        }
    }, 100);
});

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

const defineWorkoutGeneralProps = (workout) => {
    Object.defineProperties(workout,
        {
            prepareTimeMs: {
                get: function () {
                    return (workout.prepareTimeM * 60 + workout.prepareTimeS) * 1000;
                }
            },
            totalTime: {
                get: function () {
                    if (!workout.isExpand) {
                        const totalS = (workout.prepareTimeM * 60 + workout.prepareTimeS)
                            + (workout.params.roundCount * (workout.params.roundTimeM * 60 + workout.params.roundTimeS))
                            + ((workout.params.roundCount - 1) * (workout.params.restBetweenRoundsM * 60 + workout.params.restBetweenRoundsS));

                        return formatTime(totalS);
                    } else {
                        let totalS = workout.prepareTimeM * 60 + workout.prepareTimeS;
                        workout.params.forEach(round => {
                            totalS += (round.roundTimeM * 60 + round.roundTimeS) + (round.restBetweenRoundsM * 60 + round.restBetweenRoundsS);
                        })
                        totalS -= workout.params[workout.params.length - 1].restBetweenRoundsS;

                        return formatTime(totalS);
                    }
                }
            }
        }
    );
};

const defineWorkoutProps = (workout) => {
    defineWorkoutGeneralProps(workout);
    if (!workout.isExpand) {
        defineWorkoutModeProps(workout.params);
    } else {
        workout.params.forEach(round => {
            defineWorkoutModeProps(round);
        })
    }
};

const defineWorkoutWatchers = (obj) => {
    obj.watchers = [];
    for (const key in obj) {
        if (typeof obj[key] === 'number')
            obj.watchers.push(
                watch(() => obj[key], (newVal) => {
                    if (typeof obj[key] === 'string' && !isNaN(obj[key])) {
                        console.log(key, newVal);
                        obj[key] = parseInt(newVal);
                    }
                })
            );
    }
}

export default function useWorkout(page = null) {
    const router = useRouter();
    const route = useRoute();
    const init = async () => {
        const workoutTemp = reactive({
            title: 'Пробная тренировка',
            voiceSelected: 'Microsoft Irina - Russian (Russia)',
            isExpand: false,
            prepareTimeM: 0,
            prepareTimeS: 3,
            params: reactive({...simpleMode}),
        });
        await defineWorkoutProps(workoutTemp);
        workout.value = workoutTemp;
        defineWorkoutWatchers(workout.value)
        defineWorkoutWatchers(workout.value.params)

        if (page === 'workouts.show') {
            if (workouts.value.length > 0) {
                isWorkoutEdit.value = false;
                const copiedWorkout = reactive(await _.cloneDeep(workouts.value.find(work => work.id === parseInt(route.params.id))));
                defineWorkoutWatchers(copiedWorkout);
                if (copiedWorkout.isExpand) {
                    copiedWorkout.params.forEach((round, index, array) => {
                        array[index] = reactive(round);
                        defineWorkoutWatchers(round);
                    })
                } else {
                    copiedWorkout.params = reactive(copiedWorkout.params);
                    defineWorkoutWatchers(copiedWorkout.params);
                }
                await defineWorkoutProps(copiedWorkout);
                workout.value = copiedWorkout;
                watch(workout.value, (newVal, oldVal) => {
                        if (newVal && oldVal) {
                            isWorkoutEdit.value = true
                        }
                    },
                    {deep: true, immediate: true}
                );
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

    const restStageTimer = async () => {
        if (!isWorkoutStart.value || isPaused.value) return;
        if (s >= 1) {
            setTimeout(restStageTimer, 100);
        } else {
            if (r - 1 < (workout.value.params.roundCount || workout.value.params.length)) {
                clearInterval(timerInterval);
                isRest.value = !isRest.value;
                workStage();
            }
        }
    }

    const restStage = async () => {
        currentStageTimer = restStageTimer;
        timerInterval = timerCount(workout.value.params.restBetweenRoundsMs || workout.value.params[r - 1].restBetweenRoundsMs);
        isRest.value = true;
        await playAudio(bell);
        restStageTimer();
    }

    const workStageTimer = async function workStageTimer() {
        if (!isWorkoutStart.value) return;
        if (!workout.value.isExpand) {
            if (s >= 1) {
                await playRandomPunch();
                p++;
                if (p === workout.value.params.punchCount) {
                    p = 0;
                    await calcSleep(end, workout.value.params.restBetweenPunchMs)
                } else {
                    await calcSleep(end, 1000)
                }
                if (isPaused.value) {
                    return;
                }
                setTimeout(workStageTimer, 100);

            } else {
                clearInterval(timerInterval);
                isWork.value = false;
                if (r < workout.value.params.roundCount) {
                    restStage();
                } else {
                    r = 0;
                    isWorkoutStart.value = !isWorkoutStart;
                    await playAudio(bell);
                }
            }
        } else {
            if (s >= 1) {
                await playRandomPunch(workout.value.params[r].checked);
                p++;
                if (p === workout.value.params[r].punchCount) {
                    p = 0;
                    await calcSleep(end, workout.value.params[r].restBetweenPunchMs)
                } else {
                    await calcSleep(end, 1000)
                }
                if (isPaused.value) {
                    return;
                }
                if (!isWorkoutStart.value) return;
                setTimeout(workStageTimer, 100);
            } else {
                clearInterval(timerInterval);
                isWork.value = false;
                r++;
                if (r < workout.value.params.length) {
                    restStage();
                } else {
                    isWorkoutStart.value = !isWorkoutStart;
                    await playAudio(bell);
                }
            }
        }

    }

    const workStage = async () => {
        currentStageTimer = workStageTimer;
        roundCount.value = `${r + 1}/${workout.value.params.roundCount || workout.value.params.length}`;
        timerInterval = timerCount(workout.value.params.roundTimeMs || workout.value.params[r].roundTimeMs);
        isWork.value = true;
        end = workout.value.isExpand
            ? Date.now() + workout.value.params[r].roundTimeMs
            : Date.now() + workout.value.params.roundTimeMs
        await playAudio(bell);
        workStageTimer();
    }

    const prepareStageTimer = async () => {
        if (!isWorkoutStart.value || isPaused.value) return;
        if (s >= 1) {
            setTimeout(prepareStageTimer, 100);
        } else {
            clearInterval(timerInterval);
            isPrepare.value = false;
            workStage();
        }
    }

    const prepareStage = async () => {
        currentStageTimer = prepareStageTimer;
        timerInterval = timerCount(workout.value.prepareTimeMs)
        isPrepare.value = true;
        prepareStageTimer();
    }

    const start = async () => {
        isWorkoutStart.value = true;
        roundCount.value = `1/${workout.value.params.roundCount || workout.value.params.length}`;
        prepareStage();
    };

    const stop = () => {
        isWorkoutStart.value = false;
        r = 0;
        s = 0;
        p = 0;
        clearInterval(timerInterval);
        isPrepare.value = false;
        isWork.value = false;
        isRest.value = false;
    }

    const pause = () => {
        isPaused.value = true;
    }

    const resume = () => {
        isResumed = true;
        isPaused.value = false;
        if (currentStageTimer.name === 'workStageTimer')
            end = Date.now() + s * 1000;
        currentStageTimer();
    }

    const addRound = async (index, order = '') => {
        const i = (order === 'after') ? index + 1 : index
        await workout.value.params.splice(i, 0, copyObject(expandMode));
        defineWorkoutWatchers(workout.value.params[i]);
    };

    const removeRound = (index) => {
        workout.value.params.splice(index, 1);
    };

    const changeMode = async () => {
        workout.value.isExpand = !workout.value.isExpand;
        workout.value.params = workout.value.isExpand
            ? [reactive(copyObject(expandMode))]
            : reactive(copyObject(simpleMode));
        if (workout.value.isExpand) {
            defineWorkoutWatchers(workout.value.params[0])
        } else {
            defineWorkoutWatchers(workout.value.params)
        }
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
        isPaused,
        init,
        getWorkouts,
        getVoices,
        start,
        addRound,
        removeRound,
        changeMode,
        workoutStore,
        workoutUpdate,
        workoutDelete,
        stop,
        pause,
        resume
    }
}