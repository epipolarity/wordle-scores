export function scoresToChartable(scores) {

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



export function histogram(values, bins = [1, 2, 3, 4, 5, 6, 7]) {
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