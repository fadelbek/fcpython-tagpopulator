document.addEventListener('DOMContentLoaded', function() {

    console.log('beginning of popup.js');

    const competitionDropdown = document.getElementById('competition');
    const homeTeamDropdown = document.getElementById('homeTeam');
    const awayTeamDropdown = document.getElementById('awayTeam');
    const temporadaDropdown = document.getElementById('temporada');
    const recogidaDropdown = document.getElementById('recogida');
    const populateButton = document.getElementById('populateTagsButton');

    const teamsByCompetition = {
        kings: ["1K FC", "Jijantes FC", "Rayo de Barcelona", "xBuyer Team", "Aniquiladores FC", "El Barrio", "Kunisports", "Los Troncos FC", "PIO FC", "Porcinos FC", "Saiyans FC", "Ultimate Mostoles"],
        queens: ["1K FC", "Jijantas FC", "Rayo de Barcelona", "xBuyer Team", "Aniquiladoras FC", "El Barrio", "Kunitas", "Las Troncas FC", "PIO FC", "Porcinas FC", "Saiyans FC", "Ultimate Mostoles"]
      };

    const seasonByCompetition = {
        kings: ["Kings League - Split 1 2023", "Kings League - Split 2 2023", "Kings League - Split 1 2024", "Kingdom Cup 2023", "Kings Cup 2023"],
        queens: ["Queens League - Split 1 2023", "Queens League - Split 1 2024", "Queens Cup 2023", "Kingdom Cup 2023"]

    };

    function populateTeamDropdown(dropdown, teams) {
    dropdown.innerHTML = '';
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.toLowerCase().replace(/\s/g, '');
        option.textContent = team;
        dropdown.appendChild(option);
    });
    }

    function populateSeasonDropdown(dropdown, seasons) {
        dropdown.innerHTML = '';
        seasons.forEach(season => {
            const option = document.createElement('option');
            option.value = season.toLowerCase().replace(/\s/g, '');
            option.textContent = season;
            dropdown.appendChild(option);
        });
        }

    function updateTeamDropdowns() {
        const selectedCompetition = competitionDropdown.value;
        const teams = teamsByCompetition[selectedCompetition];
        populateTeamDropdown(homeTeamDropdown, teams);
        populateTeamDropdown(awayTeamDropdown, teams);
        const seasons = seasonByCompetition[selectedCompetition];
        populateSeasonDropdown(temporadaDropdown, seasons);
    }

    competitionDropdown.addEventListener('change', updateTeamDropdowns);
    updateTeamDropdowns();



    // Add a click event listener to the button
    populateButton.addEventListener('click', function () {

        const selectedHomeTeam = homeTeamDropdown.value;
        const selectedAwayTeam = awayTeamDropdown.value;
        const selectedTemporada = temporadaDropdown.value;
        const selectedCompetition = competitionDropdown.value;
        const selectedRecogida = recogidaDropdown.value;

        // Send a message to the content script to trigger the population of tags
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { 
                action: 'populateTags',
                homeTeam: selectedHomeTeam,
                awayTeam: selectedAwayTeam, 
                temporada: selectedTemporada,
                competicion: selectedCompetition,
                recogida: selectedRecogida},
                function (response) {
                // Handle the response if needed
                console.log(response.result);
            });
        });
    });

}, false);