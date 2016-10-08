var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var routeFinder = require("./app/route_finder.js")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.post('/best_route', function (req, res) {
  var flights = getFlights( // this doesn't work yet
    req.body.cities,
    req.body.start_city,
    req.body.end_city,
    req.body.start_date
  );

  var finder = new routeFinder.RouteFinder(
    req.body.cities,
    flights,
    req.body.start_city,
    req.body.end_city,
    req.body.start_date
  );

  res.json(finder.solve());
});

app.use("/api", router);
app.listen(port);
