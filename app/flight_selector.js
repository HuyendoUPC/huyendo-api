module.exports = {
  FlightSelector: function(cities, start_city, end_city, start_date) {
    this.cities = cities;
    this.start_city = start_city;
    this.end_city = end_city;
    this.start_date = start_date;
    this.flights = [];
  }
}

module.exports.FlightSelector.prototype.getFlights = function() {
  var visited = {}
  this.fillFlights(this.start_city, this.start_date, visited);

  return this.flights;
}

module.exports.FlightSelector.prototype.fillFlights = function(curCity, curDate, visited) {
  visited[curCity] = true;

  Object.keys(this.cities).forEach(function(city) {
    if(!visited[city]) {
      this.flights.push({
        originPlace: curCity,
        destinationPlace: city,
        outboundPartialDate: curDate
      })
      this.fillFlights(city, curDate + this.cities[city], visited)
    }
  }, this);

  if(
      Object.keys(visited).every(function(val) {
        return visited[val];
  })) {
    this.flights.push({
      originPlace: curCity,
      destinationPlace: this.end_city,
      outboundPartialDate: curDate
    });
  }
  
  visited[curCity] = false;
}
