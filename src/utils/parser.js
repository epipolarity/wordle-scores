// Explanation: ^\d{2}/\d{2}/\d{4}, \d{2}:\d{2} - ([a-zA-Z\s]+): Wordle ([\d,]+) ([1-6X])
// ^: Start of the line
// \d{2}/\d{2}/\d{4}: Date in the format of dd/mm/yyyy
// ,: Comma
// \d{2}:\d{2}: Time in the format of hh:mm
// - : Hyphen
// ([a-zA-Z\s]+): Player name
// : Wordle
// ([\d,]+): Game number - can be a number with commas
// ([1-6X]): Score - can be a number from 1 to 6 or X
export function parseText(text) {
    const pattern = /^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2} - ([a-zA-Z\s]+): Wordle ([\d,]+) ([1-6X])/;
    const results = {};
    const players = [];

    const lines = text.split('\n');
    lines.forEach((line) => {
        const match = pattern.exec(line);
        if (match) {
            const player = match[1].split(' ')[0];
            if (!players.includes(player)) {
                players.push(player);
            }
            const game = parseInt(match[2].replace(',', ''));
            let score = match[3];
            if (score === 'X') {
                score = 7;
            } else {
                score = parseInt(score);
            }
            if (!results[game]) {
                results[game] = { [player]: score };
            } else {
                results[game][player] = score;
            }
        }
    });

    for (const game in results) {
        const result = results[game];
        const maxScore = Math.max(...Object.values(result));
        players.forEach((player) => {
            if (!result[player]) {
                result[player] = -maxScore;
            }
        });
    }

    return results;
};