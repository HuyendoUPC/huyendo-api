module.exports = {
  Flight: function(from, to, date, arr_date, price, carrier) {
    this.from = from;
    this.to = to;
    this.date = date;
    this.arr_date = arr_date;
    this.price = price;
    this.carrier = carrier;
  },
  RouteFinder: function(cities, flights, start_city, end_city, start_date) {
    this.flights = flights;
    this.graph = this.buildGraph();
    this.cities = cities;
    this.start_city = start_city;
    this.end_city = end_city;
    this.start_date = start_date;
    this.best_paths = [];
  }
};

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
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

module.exports.RouteFinder.prototype.getBestRoute = function(visited, curPath, curCity, curDate) {
  visited[curCity] = true;
  var best_route = null;

  curDate = curDate.toISOString().slice(0, curDate.toISOString().length - 5);

  if(this.graph[curCity] === undefined || this.graph[curCity][curDate] === undefined) {
    visited[curCity] = false;
    return;
  }

  this.graph[curCity][curDate].forEach(function (flight_idx) {
    var flight = this.flights[flight_idx];

    var new_path = JSON.parse(JSON.stringify(curPath));
    new_path.route.push(flight);
    new_path.price += flight.price;

    if(flight.to === this.end_city) {
      this.best_paths.push(new_path);
      this.best_paths.sort(function (a, b) {
        return a.price - b.price;
      })
      this.best_paths = this.best_paths.slice(0, 3);
    }
    else if(!visited[flight.to]) {
      this.getBestRoute(visited, new_path, flight.to, addDays(flight.arr_date, this.cities[flight.to]));
    }
  }, this);

  visited[curCity] = false;
};

module.exports.RouteFinder.prototype.solve = function() {
  visited = {};

  try {
    this.getBestRoute(visited, { route: [], price: 0 }, this.start_city, this.start_date);
    return this.best_paths;
  } catch (e) {
    return "Impossible to get route";
  }
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
