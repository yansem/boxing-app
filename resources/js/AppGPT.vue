<template>
    <button class="w-full h-full bg-yellow-400 py-2 px-4 rounded" @click="start">Начать тренировку
        онлайн
    </button>
</template>

<script setup>
const audioFiles = [
    '/storage/sounds/1.mp3',
    '/storage/sounds/2.mp3',
    '/storage/sounds/3.mp3',
    '/storage/sounds/4.mp3',
    '/storage/sounds/5.mp3',
    '/storage/sounds/6.mp3',
    '/storage/sounds/7.mp3',
    '/storage/sounds/8.mp3'
];

const totalDuration = 5.5 * 1000; // 30 seconds
const numberOfCycles = Math.floor(totalDuration / (1 + 1 + 3 + 1 + 1));
let currentCycle = 0;
let stopPlayback = false;

function playRandomAudio() {
    if (stopPlayback) {
        return; // Stop playback immediately
    }

    const randomIndex1 = Math.floor(Math.random() * audioFiles.length);
    const randomIndex2 = Math.floor(Math.random() * audioFiles.length);
    const audioElement1 = new Audio(audioFiles[randomIndex1]);
    const audioElement2 = new Audio(audioFiles[randomIndex2]);

    audioElement1.play();

    setTimeout(() => {
        if (stopPlayback) {
            audioElement1.pause();
            return; // Stop playback immediately
        }

        audioElement1.pause();
        audioElement2.play();

        setTimeout(() => {
            if (stopPlayback) {
                audioElement2.pause();
                return; // Stop playback immediately
            }

            audioElement2.pause();

            currentCycle++;
            if (currentCycle < numberOfCycles) {
                setTimeout(playRandomAudio, 3000); // Play the next random files after a 3-second interval
            }
        }, 1000); // Play the second file with a 1-second interval
    }, 1000); // Play the first file with a 1-second interval
}


const start = () => {
    // Start the audio playback
    playRandomAudio();

// Stop playback after 30 seconds
    setTimeout(() => {
        stopPlayback = true;
    }, totalDuration);
}


</script>
