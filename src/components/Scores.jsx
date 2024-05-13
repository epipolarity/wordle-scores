import MonthPicker from './MonthPicker';
import { CustomBar } from './CustomChartComponents';
import PlayerSummaryMonth from './PlayerSummaryMonth';

import { scoresToChartable } from '../utils/scoreHandling';
import { playScores } from '../utils/music';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const chartHeight = 300;
const chartWidth = 300;

function Scores({ selectedMonth, setSelectedMonth, scores }) {

    const chartableSummary = scoresToChartable(scores);
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const [currentPlayerSummary, setCurrentPlayerSummary] = useState(null);

    useEffect(() => {
        const winner = chartableSummary.find(player => player.position === 1);
        if (winner) {
            setCurrentPlayerSummary(winner);
        }
        playScores(chartableSummary, audioContext);
    }, [scores]);

    const handleClick = (data, index) => {
        if (data.activePayload) {
            setCurrentPlayerSummary(data.activePayload[0].payload);
        }
    }

    return (
        <div id="scores">
            <MonthPicker selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
            {chartableSummary.length === 0 ?
                <p>No data yet...</p> :
                <>
                    <BarChart onClick={handleClick} width={chartWidth} height={chartHeight} data={chartableSummary}>
                        <CartesianGrid stroke="#000000" />
                        <Bar dataKey="positionInverted" fill="#8884d8" shape={<CustomBar />} />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 6]} hide={true} tickCount={0} />
                    </BarChart>
                    <PlayerSummaryMonth player={currentPlayerSummary} scores={scores} />
                </>
            }
        </div>
    );
}

export default Scores;