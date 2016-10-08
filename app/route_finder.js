module.exports = {
  Flight: function(from, to, date, arr_date, price) {
    this.from = from;
    this.to = to;
    this.date = date;
    this.arr_date = arr_date;
    this.price = price;
  },
  RouteFinder: function(cities, flights, start_city, end_city, start_date) {
    this.flights = flights;
    this.graph = this.buildGraph(flights);
    this.cities = cities;
    this.start_city = start_city;
    this.end_city = end_city;
    this.start_date = start_date;
  }
}

module.exports.RouteFinder.prototype.buildGraph = function() {
  var graph = {};

  this.flights.forEach(function(flight, idx) {
    if(!(flight.from in graph)) {
      graph[flight.from] = {};
    }

    if(!(flight.date in graph[flight.from])) {
      graph[flight.from][flight.date] = [];
    }

    graph[flight.from][flight.date].push(idx);
  });

  return graph;
};

module.exports.RouteFinder.prototype.getBestRoute = function(visited, curCity, curDate) {
  visited[curCity] = true;
  var best_route = null;

  this.graph[curCity][curDate].forEach(function (flight_idx) {
    var flight = this.flights[flight_idx];

    if(flight.to === this.end_city) {
      best_route = { 
        route: [flight],
        price: flight.price,
      };
      return;
    }

    if(visited[flight.to]) {
      return;
    }

    next_route = this.getBestRoute(visited, flight.to, flight.arr_date + cities[flight.to]);
    next_route.price += flight.price;
    next_route.route.unshift(flight);

    if(best_route === null) {
      best_route = next_route;
    }
    else if(next_route.price < best_route.price) {
      best_route = next_route;
    }
  }, this);

  visited[curCity] = false;
  return best_route;
};

module.exports.RouteFinder.prototype.solve = function() {
  visited = {};

  return this.getBestRoute(visited, this.start_city, this.start_date).route;
};

module.exports.RouteFinder.prototype.findRoute = function () {
  
};

// TEST CODE HERE
/*
cities = {
  "Barcelona": 2,
  "Paris": 3,
};

flights = [
  new Flight("London", "Barcelona", 0, 0, 20),
  new Flight("London", "Paris", 0, 0, 30),
  new Flight("Barcelona", "Paris", 2, 2, 60),
  new Flight("Paris", "Barcelona", 3, 3, 30),
  new Flight("Barcelona", "London", 5, 5, 10),
  new Flight("Paris", "London", 5, 5, 10),
];


finder = new RouteFinder(cities, flights, "London", "London", 0);
console.log(finder.solve());
*/
