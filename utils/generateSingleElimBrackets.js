// generateSingleElimBrackets(): Will generate the single-elimination brackets for tournaments.
function generateSingleElimBrackets(size){
    const rounds = Math.log2(size);
    console.log("Rounds: ", rounds); // Testing
    const brackets = []; 

    let matchesInRound = size / 2; 
    console.log("Matches In Round: ", matchesInRound); // Testing

    for (let round = 1; round <= rounds; round++){
        for (let match = 1; match <= matchesInRound; match++){
            brackets.push({
                roundNumber: round,
                matchNumber: match,
            }); 
        }
        matchesInRound /= 2; 
    }

    return brackets; 
}

module.exports = generateSingleElimBrackets; 