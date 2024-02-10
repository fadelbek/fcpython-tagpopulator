const playersByTeam = {};

const teamDataFiltered = teamData.data.filter(entry => entry.Temporada === temporadaFull);

// Iterate through each entry in the JSON data
teamDataFiltered.data.forEach(entry => {
    const playerName = entry.Nombre; // Get the player name
    const teamName = entry.Equipo; // Get the team name

    // Check if the team already exists in the playersByTeam object
    if (playersByTeam.hasOwnProperty(teamName)) {
        // If the team exists, push the player name to its array of players
        playersByTeam[teamName].push(playerName);
    } else {
        // If the team doesn't exist, create a new array with the player name
        playersByTeam[teamName] = [playerName];
    }
});