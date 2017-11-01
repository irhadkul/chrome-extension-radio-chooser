/**
 * Created by Irhad on 29.10.2017.
 */

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
    // Query filter to be passed to chrome.tabs.query - see
    // https://developer.chrome.com/extensions/tabs#method-query
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, (tabs) => {
        // chrome.tabs.query invokes the callback with a list of tabs that match the
        // query. When the popup is opened, there is certainly a window and at least
        // one tab, so we can safely assume that |tabs| is a non-empty array.
        // A window can only have one active tab at a time, so the array consists of
        // exactly one tab.
        var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
});

}

/**
 * Change the radio station and play it in audio player
 *
 * @param {string} station The new background color.
 */

function chooseRadioStation(station){

    var audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.src = station;
    audioPlayer.play();

}
/**
 * @param {string} station
 * @param {string} url
 */

function fillStationsWithSavedOnes(station,url) {
 getStationsWithSavedOnes(null,function (stations) {
     if(stations.stations === undefined){
         var items = {};
         items["stations"]=[{name:station,url:url}];
         chrome.storage.globStorage.set(items);
     }else {
         stations["stations"].push({name:station,url:url});
         chrome.storage.globStorage.set(stations);
     }
     updateDropdownValues();


 });
}

/**
 * @param {string} stations
 * @param {function} callback
 */

function getStationsWithSavedOnes(stations,callback) {
    chrome.storage.globStorage.get(stations, (stations) => {
        callback(chrome.runtime.lastError ? null : stations);
});

}

/**
 * Gets the saved radio station.
 *
 * @param {string} state of the radio station
 * @param {function(string)} callback with saved radio stations with the given state
 */

function getSavedRadioStation(state,callback){

    chrome.storage.globStorage.get(state, (items) => {
        callback(chrome.runtime.lastError ? null : items[state]);
});

}

/**
 * saves radio station with given state
 * @param {string} state
 * @param {string} station
 */

function saveRadioStation(state,station) {
    var items = {};
    items[state] = station;
    chrome.storage.globStorage.set(items);
}

/**
 * function to update dropdown values of the radio stations
 */
function updateDropdownValues(){
    var dropdown = document.getElementById('radioStations');

    getStationsWithSavedOnes("stations",(stations) => {

        if(stations.stations){
        dropdown.innerHTML="";
        stations.stations.forEach(function (p1, p2, p3){
            var opt = document.createElement('option');
            opt.value = p1.url;
            opt.innerHTML = p1.name;
            dropdown.appendChild(opt);
        })

    }
});
}

document.addEventListener('DOMContentLoaded', () => {
    getCurrentTabUrl((url) => {
    var dropdown = document.getElementById('radioStations');
    var stationAddBtn = document.getElementById("stationAdd");

    // Load the radio station that is last played  and modify the dropdown
    // value, if needed.

    updateDropdownValues();


    getSavedRadioStation("played",(playedStation) => {

        if(playedStation){
            chooseRadioStation(playedStation);
            dropdown.value=playedStation;
        }else{
            chooseRadioStation(dropdown[1].value);
            dropdown.value=dropdown[1].value;
        }
    });

    // Ensure the background color is changed and saved when the dropdown
    // selection changes.
    dropdown.addEventListener('change', () => {
        chooseRadioStation(dropdown.value);
        saveRadioStation("played",dropdown.value);


    });
    stationAddBtn.addEventListener("click",() => {
        var stationAddInput = document.getElementById("stationUrl").value;
        var stationAddNameInput = document.getElementById("stationName").value;
        fillStationsWithSavedOnes(stationAddNameInput,stationAddInput);

    })

    });
});



