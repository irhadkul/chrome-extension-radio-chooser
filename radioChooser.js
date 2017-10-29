/**
 * Created by Irhad on 29.10.2017.
 */
// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

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

    // Most methods of the Chrome extension APIs are asynchronous. This means that
    // you CANNOT do something like this:
    //
    // var url;
    // chrome.tabs.query(queryInfo, (tabs) => {
    //   url = tabs[0].url;
    // });
    // alert(url); // Shows "undefined", because chrome.tabs.query is async.
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
 * @param {string} name
 */

function fillStationsWithSavedOnes(station,name) {
    var stations = {};
    stations[name]=station;

    chrome.storage.sync.set(stations);
}

/**
 * @param {string} stations
 * @param {function} callback
 */

function getStationsWithSavedOnes(stations,callback) {
    chrome.storage.sync.get(stations, (stations) => {
        callback(chrome.runtime.lastError ? null : stations[0]);
});
}

/**
 * Gets the saved radio station.
 *
 * @param {string} state of the radio station
 * @param {function(string)} callback with saved radio stations with the given state
 */

function getSavedRadioStation(state,callback){

    chrome.storage.sync.get(state, (items) => {
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
    chrome.storage.sync.set(items);
}

// This extension loads the saved background color for the current tab if one
// exists. The user can select a new background color from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage. The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
// to a document's origin. Also, using chrome.storage.sync instead of
// chrome.storage.local allows the extension data to be synced across multiple
// user devices.
document.addEventListener('DOMContentLoaded', () => {
    getCurrentTabUrl((url) => {
    var dropdown = document.getElementById('radioStations');
    var stationAddBtn = document.getElementById("stationAdd");

    // Load the radio station that is last played  and modify the dropdown
    // value, if needed.


    getStationsWithSavedOnes("stations",(stations) => {

        if(stations){

            for (var i = 0; i<=stations.length; i++){
                var opt = document.createElement('option');
                opt.value = i;
                opt.innerHTML = i;
                dropdown.appendChild(opt);
            }

        }
    });


    getSavedRadioStation("played",(playedStation) => {

        if(playedStation){
            chooseRadioStation(playedStation);
            dropdown.value=playedStation;
        }
    });

    // Ensure the background color is changed and saved when the dropdown
    // selection changes.
    dropdown.addEventListener('change', () => {
        chooseRadioStation(this.value);
        saveRadioStation("played",dropdown.value);


    });
    stationAddBtn.addEventListener("click",() => {
        var stationAddInput = document.getElementById("stationUrl").value;
        fillStationsWithSavedOnes(stationAddInput,"name:"+stationAddInput);

    })

    });
});


