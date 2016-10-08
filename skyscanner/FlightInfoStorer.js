var route_finder = require('../app/route_finder.js');

var places = {};
var carriers = {};
var cheapestQuote = {};

function storePlacesInfo(root) {
    var allPlaces = root.Places;
    allPlaces.forEach(function (place) {
        places[place.PlaceId] = place.Name;
    });
}

function storeCarriersInfo(root) {
    var allCarriers = root.Carriers;
    allCarriers.forEach(function (carrier) {
        carriers[carrier.CarrierId] = carrier.Name;
    });
}

function storeFlightInfo(root) {
    var allQuotes = root.Quotes;
    var cheapestFlight = {};
    allQuotes.forEach(function (quote) {
        var outboundLeg = quote.OutboundLeg;
        if (cheapestFlight === {} || quote.MinPrice < cheapestFlight.minPrice) {
            cheapestFlight = new route_finder.Flight(
                outboundLeg.OriginId,
                outboundLeg.DestinationId,
                outboundLeg.DepartureDate,
                outboundLeg.DepartureDate,
                quote.MinPrice);
        }
    });
    cheapestQuote = cheapestFlight;
}

function storeAllInfo(root, findRouteCallback) {
    storeFlightInfo(responseText);
    storeCarriersInfo(responseText);
    storePlacesInfo(responseText);
}
