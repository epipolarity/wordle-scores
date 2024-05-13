
const musicGrid = [
    [
        { note: 'C', frequency: 261.63 },
        { note: 'D', frequency: 293.66 },
        { note: 'E', frequency: 329.63 },
        { note: 'G', frequency: 392.00 },
        { note: 'A', frequency: 440.00 },
    ],
    [
        { note: 'C', frequency: 261.63 },
        { note: 'E', frequency: 329.63 },
        { note: 'F#', frequency: 369.99 },
        { note: 'G', frequency: 392.00 },
        { note: 'B', frequency: 493.88 },
    ],
    [
        { note: 'D', frequency: 293.66 },
        { note: 'E', frequency: 329.63 },
        { note: 'G', frequency: 392.00 },
        { note: 'A', frequency: 440.00 },
        { note: 'B', frequency: 493.88 },
    ],
    [
        { note: 'C', frequency: 261.63 },
        { note: 'D', frequency: 293.66 },
        { note: 'F', frequency: 349.23 },
        { note: 'G', frequency: 392.00 },
        { note: 'B', frequency: 493.88 },
    ],
    [
        { note: 'C#', frequency: 277.18 },
        { note: 'D#', frequency: 311.13 },
        { note: 'F#', frequency: 369.99 },
        { note: 'G#', frequency: 415.30 },
        { note: 'Bb', frequency: 466.16 },
    ],
];


export function playScores(chartScores, audioContext) {

    if (chartScores.length === 0) {
        return;
    }

    for (let i = 0; i < chartScores.length; i++) {
        const noteGain = 0.2;
        const noteStartTime = i * 0.1;
        const envelope = audioContext.createGain();
        envelope.connect(audioContext.destination);
        envelope.gain.setValueAtTime(0, audioContext.currentTime);
        envelope.gain.setValueAtTime(0, audioContext.currentTime + noteStartTime);
        envelope.gain.linearRampToValueAtTime(noteGain, audioContext.currentTime + noteStartTime + 0.1);
        envelope.gain.linearRampToValueAtTime(0, audioContext.currentTime + noteStartTime + 0.2);
        let frequency = musicGrid[i][chartScores[i].position - 1].frequency;
        if (chartScores[i].mean < 4) {
            frequency *= 2;
        } else if (chartScores[i].mean > 4.5) {
            frequency *= 0.5;
        }
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.connect(envelope);
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);
        // Disconnect the oscillator after it has finished playing
        oscillator.onended = function () {
            oscillator.disconnect();
        };
    }

}