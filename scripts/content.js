function getDataFromStorage(callback) {
    chrome.storage.local.get(['myData', 'myDataQueens'], results => {
        const data = results.myData;
        const dataQueens = results.myDataQueens;

        if (data && dataQueens) {
            // If both sets of data are found, pass them to the callback function
            callback(data, dataQueens);
        } else {
            console.error('Data not found in storage');
        }
    });
}

function translateSeasonIdentifier(temporada) {
    switch (temporada) {
        case "kingsleague-split12023":
            return "Kings League - Split 1 2023";
        case "kingsleague-split22023":
            return "Kings League - Split 2 2023";
        case "kingsleague-split12024":
            return "Kings League - Split 1 2024";
        case "kingdomcup2023":
            return "Kingdom Cup 2023";
        case "kingscup2023":
            return "Kings League - Kings Cup 2023";
        case "queensleague-split12023":
            return "Queens League - Split 1 2023";
        case "queensleague-split12024":
            return "Queens League - Split 1 2024";
        case "queenscup2023":
            return "Queens League - Queens Cup 2023";
        default:
            return null; // Return null for unknown identifiers
    }
}

function translateTeamIdentifier(team) {
    switch (team) {
        case "1kfc":
            return "1K FC";
        case "jijantesfc":
            return "Jijantes FC";
        case "jijantasfc":
            return "Jijantas FC";
        case "rayodebarcelona":
            return "Rayo de Barcelona";
        case "xbuyerteam":
            return "xBuyer Team";
        case "aniquiladoresfc":
            return "Aniquiladores FC";
        case "aniquiladorasfc":
            return "Aniquiladoras FC";
        case "elbarrio":
            return "El Barrio";
        case "kunisports":
            return "Kunisports";
        case "kunitas":
            return "Kunitas";
        case "lostroncosfc":
            return "Los Troncos FC";
        case "lastroncasfc":
            return "Las Troncas FC";
        case "piofc":
            return "PIO FC";
        case "porcinosfc":
            return "Porcinos FC";
        case "porcinasfc":
            return "Porcinas FC";
        case "saiyansfc":
            return "Saiyans FC";
        case "ultimatemostoles":
            return "Ultimate Mostoles";
        default:
            return null; // Return null for unknown identifiers
    }
}



getDataFromStorage((data, dataQueens) => {

    data.forEach(entry => {
        if (entry.Equipo === "Ultimate Móstoles") {
            entry.Equipo = "Ultimate Mostoles";
        }
    });

    dataQueens.forEach(entry => {
        if (entry.Equipo === "Ultimate Móstoles") {
            entry.Equipo = "Ultimate Mostoles";
        }
    });

    function populateTeamTags(data, dataQueens, competicion, temporada, homeTeam, awayTeam) {

        let teamData;
        //Reinitialize home and away tags to default values
        if(competicion === 'kings'){
            teamData = data;
        }
        else if(competicion === 'queens'){
            teamData = dataQueens;
        }
        
        const temporadaFull = translateSeasonIdentifier(temporada);

        const playersByTeam = {};

        const teamDataFiltered = teamData.filter(entry => entry.Temporada === temporadaFull);

        // Iterate through each entry in the JSON data
        teamDataFiltered.forEach(entry => {
            const playerName = entry["NOMBRES DEFINITIVOS"]; // Get the player name
            const teamName = entry.Equipo;

            if(teamName === "Ultimate Móstoles"){
                teamName = "Ultimate Mostoles";
            }; // Get the team name and normalize Mostoles name

            // Check if the team already exists in the playersByTeam object
            if (playersByTeam.hasOwnProperty(teamName)) {
                // If the team exists, push the player name to its array of players
                playersByTeam[teamName].push(playerName);
            } else {
                // If the team doesn't exist, create a new array with the player name
                playersByTeam[teamName] = [playerName];
            }
        });
        // Define an empty object to store players by team

        homeTeam = translateTeamIdentifier(homeTeam);
        awayTeam = translateTeamIdentifier(awayTeam);

        const homeTeamTag = document.querySelector('.home-tags .team-tag');
        const awayTeamTag = document.querySelector('.away-tags .team-tag');

        homeTeamTag.textContent = homeTeam;
        awayTeamTag.textContent = awayTeam;
        
        const homePlayers = playersByTeam[homeTeam] || [];
        const awayPlayers = playersByTeam[awayTeam] || [];

        const homePlayerTags = document.querySelectorAll('.home-player');
        const awayPlayerTags = document.querySelectorAll('.away-player');

        for(let i=0;i<15;i++){
            homePlayerTags[i].textContent = "H" + (i+1);
            awayPlayerTags[i].textContent = "A" + (i+1);
        }

        for(let i=0;i<15;i++){
            homePlayerTags[i].textContent = homePlayers[i];
            awayPlayerTags[i].textContent = awayPlayers[i];

            if(homePlayerTags[i].textContent === ''){
                homePlayerTags[i].textContent = "H" + (i+1);
            }
            if(awayPlayerTags[i].textContent === ''){
                awayPlayerTags[i].textContent = "A" + (i+1);
            }
        }
    }

    function populateEventTags(recogida) {

        let eventTags;

        const eventTagsContainer = document.getElementById('tags');
    
        // Replace these values with the actual event tags you want to populate
        const defensaTags = ['DAI', 'DAG', 'ND', 'RC', 'RF','REE','REF','NJTS','NJTF','FRA','FR','NBI','NRB','EPT','MANO','OFF','CA','MALS','MALC','WP','PASI'];
        const pasesTags = ['PAP', 'PAS', 'PFP', 'PFS'];
        
        if(recogida === 'defensa'){
            eventTags = defensaTags;
        }
        else if(recogida === 'pases'){
            eventTags = pasesTags;
        }

        eventTagsContainer.innerHTML = '';

        eventTags.forEach((tag) => {
            const newTag = document.createElement('div');
            newTag.className = 'tag';
            newTag.contentEditable = 'false';
            newTag.setAttribute('onclick', 'changeEventFocus(this)');
            newTag.innerHTML = `<p>${tag}</p>`;
            eventTagsContainer.appendChild(newTag);
        });

    }
    
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'populateTags') {
            populateTeamTags(data, dataQueens, message.competicion, message.temporada, message.homeTeam, message.awayTeam);
            populateEventTags(message.recogida);
    
            sendResponse({ result: 'Tags populated successfully' });
        }
    })

});