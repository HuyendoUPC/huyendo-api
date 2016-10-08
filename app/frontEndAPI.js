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

//@parameter solutions:
//      this object contains 3 routes. best: the best route, second: the second best route, third: the third best route.
//@returns:
//      an object containing the route data for each of the 3 best routes.
function getDataForAllSolutionFlights(solutions) {
    return {
        best: getSolutionRouteData(solutions.best),
        second: getSolutionRouteData(solutions.second),
        third: getSolutionRouteData(solutions.third)
    }
}

