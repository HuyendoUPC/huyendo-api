var places = {};
var carriers = {};
var quotes = {};

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
    allQuotes.forEach(function (quote) {
        var outboundLeg = quote.OutboundLeg;
        quotes[quote.QuoteId] = {
            minPrice: quote.MinPrice,
            carrier: outboundLeg.CarrierIds[0],
            originId: outboundLeg.OriginId,
            destinationId: outboundLeg.DestinationId,
            departureDate: outboundLeg.DepartureDate};
    });
}
