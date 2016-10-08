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
    root = JSON.parse(root);
    var allQuotes = root.Quotes;
    var places = storePlacesInfo(root);
    var cheapestFlight = new route_finder.Flight(
      places[allQuotes[0].OutboundLeg.OriginId],
      places[allQuotes[0].OutboundLeg.DestinationId],
      allQuotes[0].OutboundLeg.DepartureDate,
      allQuotes[0].OutboundLeg.DepartureDate,
      allQuotes[0].MinPrice,
      allQuotes[0].OutboundLeg.CarrierIds[0]
    );

    allQuotes.forEach(function (quote) {
        var outboundLeg = quote.OutboundLeg;
        if (cheapestFlight === {} || quote.MinPrice < cheapestFlight.MinPrice) {
            cheapestFlight = new route_finder.Flight(
                places[outboundLeg.OriginId],
                places[outboundLeg.DestinationId],
                new Date(outboundLeg.DepartureDate),
                new Date(outboundLeg.DepartureDate),
                quote.MinPrice,
                outboundLeg.CarrierIds[0]
            );
        }
    });

    return cheapestFlight;
}

module.exports = {
  storeAllInfo: function(root, routes) {
    if(root.Quotes === undefined) {
      return;
    }
    
    routes.push(storeFlightInfo(root));
  }
};
