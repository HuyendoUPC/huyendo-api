var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var flightSelector = require("./app/flight_selector.js");
var skyscanner = require("./skyscanner/SkyScannerJSONRetriever.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.post('/best_route', function (req, res) {
  var selector = new flightSelector.FlightSelector(
    req.body.cities,
    req.body.start_city,
    req.body.end_city,
    new Date(req.body.start_date)
  );
  selector.getFlights(req, res);
});

app.use("/api", router);
app.listen(port);
