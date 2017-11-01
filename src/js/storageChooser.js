/**
 * Created by Irhad on 01.11.2017.
 */

/**
 * chrome has two storage types, local and sync. with opera, sync does not work as expected.
 * options:
 * chrome.storage.sync;
 * chrome.storage.local;
 */
chrome.storage.globStorage = chrome.storage.sync;