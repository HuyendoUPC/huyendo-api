var XMLHttpRequest = require("xhr2");
var FlightInfoStorer = require('./FlightInfoStorer.js');
var routeFinder = require('../app/route_finder.js');

module.exports = {
    getResponseJSON: function (from, to, outboundPartialDate) {
        var postUrl = getAPIPostUrl(from, to, outboundPartialDate);
        makeCorsRequest(postUrl);
    }
};

function storeFlightInfo(responseText) {
    FlightInfoStorer.storeAllInfo(responseText, routeFinder.findRoute);
    console.log(responseText);
}

function getAPIPostUrl(from, to, outboundPartialDate) {
    var apiKey = getApiKey();
    var urlStem = "http://partners.api.skyscanner.net/apiservices/browseroutes/v1.0";
    var searchOptions = createSpecificSkyScannerPostUrl("GB", "GBP", "en-GB", from, to, outboundPartialDate, apiKey);
    return urlStem.concat(searchOptions);
}

function getApiKey() {
    return "prtl6749387986743898559646983194";
}

function createSpecificSkyScannerPostUrl(market, currency, locale, originPlace, destinationPlace, outboundPartialDate, apiKey) {
    return "/"
        .concat(market)
        .concat("/").concat(currency)
        .concat("/").concat(locale)
        .concat("/").concat(originPlace)
        .concat("/").concat(destinationPlace)
        .concat("/").concat(outboundPartialDate)
        .concat("?apiKey=").concat(apiKey);
}

// Create the XHR object.
function createCORSRequest(method, url) {
    var client = new XMLHttpRequest();
    client.open(method, url, true);
    return client;
}

// Make the actual CORS request.
function makeCorsRequest(url) {
    // This is a sample server that supports CORS.
    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
        console.log('CORS not supported');
        return;
    }

    // Response handlers.
    xhr.onload = function () {
        var text = xhr.responseText;
        storeFlightInfo(text);
        console.log('Response from CORS request to ' + url);
    };

    xhr.onerror = function () {
        console.log('Woops, there was an error making the request.');
    };

    xhr.send();
}
