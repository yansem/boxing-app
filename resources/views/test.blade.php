<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Application</title>
    @vite('resources/css/app.css')
</head>
<body>
<h1>Text-to-Speech Demo</h1>

<label for="textToSpeak">Enter Text:</label>
<textarea id="textToSpeak" rows="4" cols="50"></textarea>

<br>

<label for="voiceSelect">Select a Voice:</label>
<select id="voiceSelect"></select>

<br>

<label for="rate">Speech Rate:</label>
<input type="range" id="rate" min="0.1" max="10" step="0.1" value="1">
<span id="rateValue">1</span>

<br>

<button id="speakButton">Speak</button>

<script>
    if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const textToSpeakInput = document.getElementById('textToSpeak');
        const voiceSelect = document.getElementById('voiceSelect');
        const rateInput = document.getElementById('rate');
        const rateValue = document.getElementById('rateValue');

        // Populate the voiceSelect dropdown with available voices
        synth.onvoiceschanged = () => {
            const voices = synth.getVoices();
            voices.forEach(voice => {
                const option = document.createElement('option');
                option.textContent = `${voice.name} (${voice.lang})`;
                option.setAttribute('data-voice', voice.name);
                option.setAttribute('data-lang', voice.lang);
                voiceSelect.appendChild(option);
            });
        };

        // Function to speak the entered text
        function speakText() {
            const textToSpeak = textToSpeakInput.value.trim();
            if (textToSpeak !== '') {
                console.log(textToSpeak);
                const selectedVoice = voiceSelect.options[voiceSelect.selectedIndex];
                const voiceName = selectedVoice.getAttribute('data-voice');
                const voiceLang = selectedVoice.getAttribute('data-lang');

                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                utterance.voice = synth.getVoices().find(voice => voice.name === voiceName && voice.lang === voiceLang);
                utterance.rate = parseFloat(rateInput.value);
                console.log(utterance.rate);
                utterance.onerror = function(event) {
                    console.error('Speech synthesis error:', event.error);
                };

                synth.speak(utterance);
            }
        }

        // Bind the speakText function to the button click
        const speakButton = document.getElementById('speakButton');
        speakButton.addEventListener('click', speakText);

        // Update the displayed speech rate value
        rateInput.addEventListener('input', () => {
            rateValue.textContent = rateInput.value;
        });
    } else {
        alert('Speech Synthesis API is not supported in your browser.');
    }
</script>
</body>
</html>