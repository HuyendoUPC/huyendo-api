var XMLHttpRequest = require("xhr2");
var FlightInfoStorer = require('./FlightInfoStorer.js');
var routeFinder = require('../app/route_finder.js');
var moment = require("momentjs");
var http = require("http");

module.exports = {
  getResponseJSON: function (flight, routes, flights, req, res) {
    var postUrl = getAPIPostUrl(
      flight.from,
      flight.to,
      flight.outboundPartialDate
    );
    makeCorsRequest(postUrl, routes, flights, req, res);
  }
};

function getAPIPostUrl(from, to, outboundPartialDate) {
  var apiKey = getApiKey();
  var urlStem = "http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0";
  var searchOptions = createSpecificSkyScannerPostUrl("GB", "GBP", "en-GB", from, to, outboundPartialDate, apiKey);
  return urlStem.concat(searchOptions);
}

function getApiKey() {
  return "ro449194494059599980405733995432";
}

function createSpecificSkyScannerPostUrl(market, currency, locale, originPlace, destinationPlace, outboundPartialDate, apiKey) {
  return "/"
  .concat(market)
  .concat("/").concat(currency)
  .concat("/").concat(locale)
  .concat("/").concat(originPlace)
  .concat("/").concat(destinationPlace)
  .concat("/").concat(moment(outboundPartialDate).format("YYYY-MM-DD"))
  .concat("?apiKey=").concat(apiKey);
}

// Make the actual CORS request.
function makeCorsRequest(url, routes, flights, req, res) {
    // This is a sample server that supports CORS.
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    if (!xhr) {
        console.log('CORS not supported');
        return;
    }

    // Response handlers.
    xhr.onload = function () {
        var text = xhr.responseText;
        FlightInfoStorer.storeAllInfo(text, routes);
        if(routes.length === flights.length) {
          var finder = new routeFinder.RouteFinder(
            JSON.parse(req.body.cities),
            routes,
            req.body.start_city,
            req.body.end_city,
            new Date(req.body.start_date)
          );
          res.json(finder.solve());
        }
        console.log('Response from CORS request to ' + url);

    };

    xhr.onerror = function () {
        console.log('Woops, there was an error making the request.');
    };

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send();
}
