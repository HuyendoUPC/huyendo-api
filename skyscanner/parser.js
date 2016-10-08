//parses the flights once the json object has been retrieved

var places = {};

function storePlacesInfo(root) {
    var allPlaces = root.places;
    allPlaces.forEach(function (place) {
       places[place.PlaceId] = place.Name;
    });
}

var carriers = {};

function storeCarriersInfo(root) {
    var allCarriers = root.carriers;
    allCarriers.forEach(function (carrier) {
        carriers[carrier.CarrierId] = carrier.Name;
    });
}