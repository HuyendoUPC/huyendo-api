//API for getting the JSON object for a flight, in following format:
/*

 {
 from:
 to:
 departure_date:
 arrival_date:
 flight_duration:
 price:
 }

 */

function getResponseJSON(from, to, outboundPartialDate, inboundPartialDate) {
    var postUrl = getAPIPostUrl(from, to, outboundPartialDate, inboundPartialDate);
    makeCorsRequest(postUrl);
}

function httpGet(postUrl) {
    var client = createCORSRequest(postUrl);
    client.onload = function () {
        showResponseJSON(client.responseText);
    };
    client.send();
}

function showResponseJSON(responseText) {
    document.getElementById("demo").innerHTML = responseText;
}

function getAPIPostUrl(from, to, outboundPartialDate, inboundPartialDate) {
    var apiKey = getApiKey();
    var urlStem = "http://partners.api.skyscanner.net/apiservices/browseroutes/v1.0"
    var searchOptions = createSpecificSkyScannerPostUrl("GB", "GBP", "en-GB", from, to, outboundPartialDate, inboundPartialDate, apiKey);
    return urlStem.concat(searchOptions);
}

function getApiKey() {
    return "prtl6749387986743898559646983194";
}

function createSpecificSkyScannerPostUrl(market, currency, locale, originPlace, destinationPlace, outboundPartialDate, inboundPartialDate, apiKey) {
    return "/"
        .concat(market)
        .concat("/").concat(currency)
        .concat("/").concat(locale)
        .concat("/").concat(originPlace)
        .concat("/").concat(destinationPlace)
        .concat("/").concat(outboundPartialDate)
        .concat("/").concat(inboundPartialDate)
        .concat("?apiKey=").concat(apiKey);
}

// Create the XHR object.
function createCORSRequest(method, url) {
    var client = new XMLHttpRequest();
    if ("withCredentials" in client) {
        // XHR for Chrome/Firefox/Opera/Safari.
        client.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        client = new XDomainRequest();
        client.open(method, url);
    } else {
        // CORS not supported.
        client = null;
    }
    return client;
}

// Make the actual CORS request.
function makeCorsRequest(url) {
    // This is a sample server that supports CORS.
    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    // Response handlers.
    xhr.onload = function() {
        var text = xhr.responseText;
        showResponseJSON(text);
        alert('Response from CORS request to ' + url + ': ' + title);
    };

    xhr.onerror = function() {
        alert('Woops, there was an error making the request.');
    };

    xhr.send();
}