var route_finder = require('../app/route_finder.js');

function storePlacesInfo(root) {
    var places = {};
    var allPlaces = root.Places;
    allPlaces.forEach(function (place) {
        places[place.PlaceId] = place.SkyscannerCode;
    });

    return places;
}

function storeCarrierInfo(root) {
  var carriers = {};
  var allCarriers = root.Carriers;
  allCarriers.forEach(function (carrier) {
    carriers[carrier.CarrierId] = carrier.Name;
  })
  
  return carriers;
}

function storeFlightInfo(root) {
    var allQuotes = root.Quotes;
    var places = storePlacesInfo(root);
    var carriers = storeCarrierInfo(root);
    var cheapestFlight = new route_finder.Flight(
      places[allQuotes[0].OutboundLeg.OriginId],
      places[allQuotes[0].OutboundLeg.DestinationId],
      allQuotes[0].OutboundLeg.DepartureDate,
      allQuotes[0].OutboundLeg.DepartureDate,
      allQuotes[0].MinPrice,
      carriers[allQuotes[0].OutboundLeg.CarrierIds[0]]
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
                carriers[outboundLeg.CarrierIds[0]]
            );
        }
    });

    return cheapestFlight;
}

module.exports = {
  storeAllInfo: function(root, routes) {
    root = JSON.parse(root);

    if(root.Quotes.length === 0) {
      return;
    }
    
    routes.push(storeFlightInfo(root));
  }
};
