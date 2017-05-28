var attachFastClick = require('fastclick');
let wai = require('web-audio-ios');
let Random = require('random-js');
let Soundfont = require('soundfont-player');

let playInterval = 4000;
let intervals = [];
let isPlaying = false;
let speedSlider = document.querySelector("#speedSlider");
let secText = document.querySelector("#sec");
let secondsText = document.querySelector("#seconds");
let playButton = document.querySelector("#btn-play");
let unlockButton = document.querySelector("#btn-unlock");
let overlay = document.querySelector("#overlay");
let AudioContextFunc = window.AudioContext || window.webkitAudioContext;
let audioContext = new AudioContextFunc();
let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let octaves = [3, 4, 5, 6]

let press = () => {
    overlay.setAttribute("style", "visibility: hidden");
    wai(document.body, audioContext, function (unlocked) {
    });
}

let play = () => {
    if (intervals.length != 0) { clearIntervals() }
    isPlaying = !isPlaying;
    if (isPlaying) {
        playButton.textContent = "STOP"
        Soundfont.instrument(audioContext, 'acoustic_grand_piano').then(function (piano) {
            piano.play(generateRandomNoteValue())
        });
        let newInt = setInterval(() => {
            let randNote = generateRandomNoteValue();
            Soundfont.instrument(audioContext, 'acoustic_grand_piano').then(function (piano) {
                piano.play(randNote);
            })
        }, playInterval);
        intervals.push(newInt);
    } else {
        playButton.textContent = "PLAY"
        if (intervals.length != 0) {
            clearIntervals()
        }
    }
}

//slider
speedSlider.oninput = (e) => {
    secondsText.textContent = " SECONDS";
    secText.textContent = e.target.value;
}
speedSlider.onchange = (e) => {
    clearIntervals();
    playInterval = e.target.value * 1000;
    if (isPlaying) {
        isPlaying = false;
        play();
    }
}

//buttons
playButton.addEventListener('click', play);
unlockButton.addEventListener('click', press);

let generateRandomNoteValue = () => {
    let r = new Random();
    let randomNote = notes[r.integer(0, notes.length - 1)].toString() + octaves[r.integer(0, octaves.length - 1)].toString();
    return randomNote;
}

let clearIntervals = () => {
    for (let i = 0; i < intervals.length; i++) {
        clearInterval(intervals[i]);
    }
}