function getTotalCostOfRoute(flights) {
    var sum = 0;
    flights.forEach(function (flight) {
        sum += flight.price;
    });
    return sum;
}

function getSolutionRouteData(flights) {
    return {
        route: flights,
        price: getTotalCostOfRoute(flights),
        start_date: flights[0].date,
        end_date: flights[flights.length].arr_date
    }
}


