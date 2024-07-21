// Define regex patterns for Wordle and the start of a Connections entry
const wordlePattern = /^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2} - ([^:]+): Wordle ([\d,]+) ([1-6X])/;
const connectionsStartPattern = /^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2} - ([^:]+): Connections/;
const miniPattern = /^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2} - ([^:]+): I solved the/;
const otherGamePattern = /^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2} - ([^:]+):/;


export function parseText(text) {
    const players = [];
    const results = {
        Wordle: {},
        Connections: {},
        Mini: {}
    };
    const lines = text.split('\n');
    let currentGame = null;
    let currentGameLines = [];

    lines.forEach((line, index) => {
        if (miniPattern.test(line)) {
            processIfConnections(currentGame, currentGameLines, results, players);
            processMini(line, results.Mini, players);
            currentGame = "Mini";
        } else if (wordlePattern.test(line)) {
            processIfConnections(currentGame, currentGameLines, results, players);
            processWordle(line, results.Wordle, players);
            currentGame = "Wordle";
        } else if (connectionsStartPattern.test(line)) {
            processIfConnections(currentGame, currentGameLines, results, players);
            currentGame = "Connections";
            currentGameLines.push(line);
        } else if (otherGamePattern.test(line)) {
            processIfConnections(currentGame, currentGameLines, results, players);
            currentGame = null;
        } else if (currentGame === "Connections") {
            // Accumulate lines for a Connections game
            currentGameLines.push(line);
        }

        // Handle the last Connections game in the file
        if (index === lines.length - 1 && currentGame === "Connections") {
            processConnections(currentGameLines, results.Connections, players);
        }
    });

    // Apply normalization to both Wordle and Connections scores
    normalizeScores(results.Wordle, players);
    normalizeScores(results.Connections, players, true);
    normalizeScores(results.Mini, players);

    return results;
}


function processMini(line, miniResults, players) {
    const patternType1 = /^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2} - ([^:]+): .*?(\d{1,2}\/\d{1,2}\/\d{4}).*?in (\d+:\d+)!/;   // Plain text version
    const patternType2 = /^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2} - ([^:]+): .*?d=(\d{4}-\d{2}-\d{2})&t=(\d+)/;               // URL encoded version

    let match = patternType1.exec(line) || patternType2.exec(line);

    if (match) {
        const player = match[1].split(' ')[0]; // Only take the first name of the player
        managePlayer(players, player);

        const date = match[2];
        const timeInSeconds = match[3].includes(':') ?
            match[3].split(':').reduce((acc, time) => 60 * acc + parseInt(time), 0) :
            parseInt(match[3]);

        miniResults[date] = miniResults[date] || {};
        miniResults[date][player] = timeInSeconds;
    } else {
        console.log("Invalid mini result line", line);
    }
}


function processWordle(line, wordleResults, players) {
    const match = wordlePattern.exec(line);
    if (match) {

        const player = match[1].split(' ')[0]; // Only take the first name of the player
        managePlayer(players, player);

        const game = parseInt(match[2].replace(/,/g, ''));

        let score = match[3] === 'X' ? 7 : parseInt(match[3]);
        if (!wordleResults[game]) {
            wordleResults[game] = { [player]: score };
        } else {
            wordleResults[game][player] = score;
        }
    }
}


function processIfConnections(currentGame, currentGameLines, results, players) {
    if (currentGame === "Connections") {
        processConnections(currentGameLines, results.Connections, players);
        currentGameLines.length = 0; // Clear the array without creating a new one
    }
}


function processConnections(lines, connectionsResults, players) {
    const playerLine = lines[0];

    const player = playerLine.split(' - ')[1].split(':')[0].trim().split(' ')[0]; // Only take the first name of the player
    managePlayer(players, player);

    let puzzleNumber;
    try {
        let match = null;
        // Search all lines for the "Puzzle #" pattern
        for (const line of lines) {
            match = line.match(/Puzzle #([\d,]+)/);
            if (match) {
                puzzleNumber = match[1].replace(/,/g, '');
                break; // Stop searching once we find the first occurrence
            }
        }
        if (!match) {
            throw new Error("Puzzle number not found");
        }

        let score = 0;
        lines.slice(2).forEach(line => {
            if (line.match(/^🟨{4}$/u)) {
                score += 2; // Easy row
            } else if (line.match(/^🟩{4}$/u)) {
                score += 4; // Hard row
            } else if (line.match(/^🟦{4}$/u)) {
                score += 6; // Harder row
            } else if (line.match(/^🟪{4}$/u)) {
                score += 8; // Hardest row
            } else if (line.match(/[🟨🟩🟦🟪]{4}/u)) {
                score -= 1; // Incorrect guess
            }
            // Lines that don't match any of the above patterns are ignored
        });

        if (!connectionsResults[puzzleNumber]) {
            connectionsResults[puzzleNumber] = {};
        }
        connectionsResults[puzzleNumber][player] = score;

    } catch (e) {
        console.log("Error extracting puzzle number:", e);
        console.log("Lines:", lines);
    }
}


function managePlayer(players, playerName) {
    if (!players.includes(playerName)) {
        players.push(playerName);
    }
}


function normalizeScores(gameResults, players, invert = false) {
    for (const game in gameResults) {
        const result = gameResults[game];
        const worstScore = invert ? Math.min(...Object.values(result)) : Math.max(...Object.values(result));
        players.forEach((player) => {
            if (!result[player]) {
                result[player] = -worstScore; // Assign the worst score of everyone that did play
            }
        });
    }
}