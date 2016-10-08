Skyscanner = require("../skyscanner/SkyScannerJSONRetriever.js");

module.exports = {
  FlightSelector: function(cities, start_city, end_city, start_date) {
    this.cities = cities;
    this.start_city = start_city;
    this.end_city = end_city;
    this.start_date = start_date;
    this.flights = [];
    this.done = {};
  }
};

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

module.exports.FlightSelector.prototype.getFlights = function(req, res) {
  var visited = {};
  this.fillFlights(this.start_city, this.start_date, visited);

  var routes = [];
  this.flights.forEach(function(flight) {
    Skyscanner.getResponseJSON(flight, routes, this.flights, req, res);
  }, this);
};

module.exports.FlightSelector.prototype.fillFlights = function(curCity, curDate, visited) {
  visited[curCity] = true;

  function contains(list, elem) {
    var i;
    for (i = 0; i < list.length; i++) {
      el = list[i];

      if (el.from === elem.from
          && el.to === elem.to
          && el.outboundPartialDate.getTime() === elem.outboundPartialDate.getTime()) {
        return true;
      }
    }

    return false;
  }

  Object.keys(this.cities).forEach(function(city) {
    if(!visited[city]) {
      new_flight = {
        from: curCity,
        to: city,
        outboundPartialDate: curDate
      };

      if(!contains(this.flights, new_flight)) {
        this.flights.push(new_flight);
      }

      this.fillFlights(city, addDays(curDate, this.cities[city]), visited)
    }
  }, this);

  if(
      Object.keys(this.cities).every(function(val) {
        return visited[val];
  })) {
    new_flight = {
      from: curCity,
      to: this.end_city,
      outboundPartialDate: curDate
    };
   
    if(!contains(this.flights, new_flight)) {
      this.flights.push(new_flight);
    }
  }
  
  visited[curCity] = false;
};
