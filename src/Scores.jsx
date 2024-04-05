import MonthPicker from './MonthPicker';
import CustomBar from './CustomBar';
import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const chartHeight = 300;
const chartWidth = 300;

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
]

function scoresToChartable(scores) {

    if (!scores.data || scores.data.length === 0) {
        return [];
    }

    const playerNames = Object.keys(scores.summary);
    const newSummary = playerNames.map((playerName) => {
        return {
            name: playerName,
            mean: scores.summary[playerName].mean,
            missed: scores.data.reduce((acc, score) => acc + (score[playerName] < 0 ? 1 : 0), 0),
        };
    });

    // sort the players by mean score, then by number of missed games
    newSummary.sort((a, b) => {
        if (a.mean === b.mean) {
            return a.missed - b.missed;
        } else {
            return a.mean - b.mean;
        }
    });

    // first player is always in first position - even if they have the same score as the second player
    newSummary[0].position = 1;
    for (let i = 1; i < newSummary.length; i++) {
        if (newSummary[i].mean === newSummary[i - 1].mean && newSummary[i].missed === newSummary[i - 1].missed) {
            // if the player has the same score and the same number of missed words as the previous player
            // they share the same position
            newSummary[i].position = newSummary[i - 1].position;
        } else {
            // otherwise, the player is in the i+1th position
            newSummary[i].position = i + 1;
        }
    }

    // now re-sort the players by name to get consistent ordering
    newSummary.sort((a, b) => a.name.localeCompare(b.name));

    // and map to the chartable format with all required fields
    return newSummary.map((player, index) => ({
        name: player.name,
        img: player.name.toLowerCase() + ".jpg",
        mean: player.mean,
        missed: player.missed,
        position: player.position,
        positionInverted: 7 - player.position,
        fill: ["#ED5564", "#FFCE54", "#A0D568", "#4FC1E8", "#AC92EB"][index % 5], // use a different color for each player
    }));

}

function playScores(chartScores, audioContext) {

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

function Scores({ selectedMonth, setSelectedMonth, scores }) {

    const chartableSummary = scoresToChartable(scores);
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    useEffect(() => {
        playScores(chartableSummary, audioContext);
    }, [scores]);

    return (
        <>
            <MonthPicker selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
            {chartableSummary.length === 0 ?
                <p>No data yet...</p> :
                <BarChart width={chartWidth} height={chartHeight} data={chartableSummary}>
                    <CartesianGrid stroke="#000000" />
                    <Bar dataKey="positionInverted" fill="#8884d8" shape={<CustomBar />} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 6]} hide={true} tickCount={0} />
                </BarChart>
            }
        </>
    );
}

export default Scores;