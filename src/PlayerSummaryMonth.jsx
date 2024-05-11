import './PlayerSummaryMonth.css';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useEffect, useState, PureComponent } from 'react';

function histogram(values, bins = [1, 2, 3, 4, 5, 6, 7]) {
    if (values) {
        const hist = bins.map((bin) => {
            return {
                bin: bin === bins[bins.length - 1] ? 'X' : bin,
                count: values.filter((value) => value === bin).length
            };
        });
        return hist;
    } else {
        return [];
    }
}

class HistCountLabel extends PureComponent {
    render() {
        const { x, y, width, height, value } = this.props;
        return (
            <text x={x + width} y={y} dy={height * 0.75} dx={-height / 5} fontWeight="bold" fill="white" fontSize={height * 0.8} textAnchor="end">
                {value > 0 ? value : ''}
            </text>
        );
    }
}

class DistAxisLabel extends PureComponent {
    render() {
        const { x: left, y: top, width, height } = this.props.viewBox;

        const x = left - 10 + width / 2;
        const y = top + 10 + height / 2;

        return (
            <text x={x} y={y} transform={`rotate(-90,${x},${y})`} fill="black" fontWeight="bold" fontSize={16} textAnchor="middle">
                SCORE DISTRIBUTION
            </text>
        );
    }
}

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