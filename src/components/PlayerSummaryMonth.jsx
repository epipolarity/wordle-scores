import './PlayerSummaryMonth.css';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

import { HistCountLabel, DistAxisLabel } from './CustomChartComponents';

import { histogram } from '../utils/scoreHandling';

function PlayerSummaryMonth({ player, scores }) {

    const style = {
        position: 'relative',
        backgroundImage: 'url(' + process.env.PUBLIC_URL + '/images/full/' + player?.img + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#000',
        padding: '10px',
    };

    const [gamesPlayed, setGamesPlayed] = useState(0);

    useEffect(() => {
        if (player && scores.data) {
            setGamesPlayed(
                scores.data.filter((score) => score[player.name] >= 0)
                    .map((score) => score[player.name])
            );
        }
    }, [scores, player]);

    if (player) {
        const { name, mean, missed, position } = player;

        let prize = '';
        if (position === 1) {
            prize = '🥇';
        } else if (position === 2) {
            prize = '🥈';
        } else if (position === 3) {
            prize = '🥉';
        } else {
            prize = '';
        }

        const hist = histogram(gamesPlayed);

        return (
            <div id="playerSummary" style={style}>
                <h2>{name} {prize}</h2>
                <p>Average score: {mean.toFixed(2)}</p>
                <p>Games played: {gamesPlayed.length}</p>
                <p>Games missed: {missed}</p>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart layout="vertical" data={hist}>
                        <Bar dataKey="count" fill="#787c7e" label={<HistCountLabel />} />
                        <XAxis type="number" />
                        <YAxis label={<DistAxisLabel />} dataKey="bin" type="category" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    } else {
        return (
            <div>
                {'Click a player to see their monthly summary'}
            </div>
        );
    }
}

export default PlayerSummaryMonth;