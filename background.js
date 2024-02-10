function fetchData(){

    //const urlkingslocal = "https://script.google.com/macros/s/AKfycbxsAvlRm936bRzRWFqU9yInHqqZU2HM_rs2RT7C_BYQp0nz-ICvd6n7fTJjl6HJBzsGzQ/exec";
    //const urlqueenslocal = "https://script.google.com/macros/s/AKfycbwIhXA9Ty9B58ue5IyWcCGV5FIovJf5iJt5cMsN6jamzwEtdaliPC75cPf_3U1_2LaQNQ/exec";

    const urlkings = "https://script.google.com/macros/s/AKfycbzlcNhbTRc2vkyjzNt2JzWv4Ph0if4DhwoCYPIkz40HFNfONko_WlBPK-LwXHmpJBLL/exec"
    const urlqueens = "https://script.google.com/macros/s/AKfycbxh0u-Za6t5TLgyIotYE6w4obCWuQ0ItWGabfNBUbcIWvT2_5fpqdSQ9TAsA3mBP4IA/exec"

    console.log("Access fetchData FCT");
    fetch(urlkings)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Check if the first element of the JSON response array contains the "data" property
            if (!data[0] || !data[0].hasOwnProperty('data')) {
                throw new Error('No "data" property found in the JSON response');
            }
            
            // Store the "data" property from the first element in a variable
            const dataArray = data[0].data;

            // Do whatever you need with the "dataArray"
            console.log('Data array Kings:', dataArray);
            
            // Example: Store the "dataArray" in Chrome's storage
            chrome.storage.local.set({ 'myData': dataArray }, () => {
                console.log('Data stored in Chrome storage:', dataArray);
            });
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error);
        });

    fetch(urlqueens)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(dataq => {
            // Check if the first element of the JSON response array contains the "data" property
            if (!dataq[0] || !dataq[0].hasOwnProperty('data')) {
                throw new Error('No "data" property found in the JSON response');
            }
            
            // Store the "data" property from the first element in a variable
            const dataArrayQueens = dataq[0].data;

            // Do whatever you need with the "dataArray"
            console.log('Data array Queens:', dataArrayQueens);
            
            // Example: Store the "dataArray" in Chrome's storage
            chrome.storage.local.set({ 'myDataQueens': dataArrayQueens }, () => {
                console.log('Data stored in Chrome storage:', dataArrayQueens);
            });
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error);
        });
}

console.log("Background JS");

// Call fetchData() when extension is installed or started
chrome.runtime.onInstalled.addListener(fetchData);
chrome.runtime.onStartup.addListener(fetchData);
