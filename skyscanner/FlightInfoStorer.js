var route_finder = require('../app/route_finder.js');

function storePlacesInfo(root) {
    var places = {};
    var allPlaces = root.Places;
    allPlaces.forEach(function (place) {
        places[place.PlaceId] = place.SkyscannerCode;
    });

    return places;
}

function storeFlightInfo(root) {
    var allQuotes = root.Quotes;
    var cheapestFlight = {};
    var places = storePlacesInfo(root);
    allQuotes.forEach(function (quote) {
        var outboundLeg = quote.OutboundLeg;
        if (cheapestFlight === {} || quote.MinPrice < cheapestFlight.minPrice) {
            cheapestFlight = new route_finder.Flight(
                places[outboundLeg.OriginId],
                places[outboundLeg.DestinationId],
                outboundLeg.DepartureDate,
                outboundLeg.DepartureDate,
                quote.MinPrice,
                outboundLeg.CarrierIds[0]
            );
        }
    });
    return cheapestFlight;
}

module.exports = {
  storeAllInfo: function(root, routes) {
      routes.push(storeFlightInfo(root));
  }
}
