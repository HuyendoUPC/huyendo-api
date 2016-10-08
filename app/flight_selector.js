Skyscanner = require("../skyscanner/SkyScannerJSONRetriever.js")

module.exports = {
  FlightSelector: function(cities, start_city, end_city, start_date) {
    this.cities = cities;
    this.start_city = start_city;
    this.end_city = end_city;
    this.start_date = start_date;
    this.flights = [];
  }
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

module.exports.FlightSelector.prototype.getFlights = function() {
  var visited = {};
  this.fillFlights(this.start_city, this.start_date, visited);

  console.log(this.flights);

  var routes = [];
  this.flights.forEach(function(flight, idx) {
    Skyscanner.getResponseJSON(flight, routes);
  });

  while(routes.length !== this.flights.length);

  return this.flights;
}

module.exports.FlightSelector.prototype.fillFlights = function(curCity, curDate, visited) {
  visited[curCity] = true;

  Object.keys(this.cities).forEach(function(city) {
    if(!visited[city]) {
      this.flights.push({
        from: curCity,
        to: city,
        outboundPartialDate: curDate
      })
      this.fillFlights(city, addDays(curDate, this.cities[city]), visited)
    }
  }, this);

  if(
      Object.keys(visited).every(function(val) {
        return visited[val];
  })) {
    this.flights.push({
      from: curCity,
      to: this.end_city,
      outboundPartialDate: curDate
    });
  }
  
  visited[curCity] = false;
}
