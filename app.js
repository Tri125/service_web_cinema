var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var expressValidator = require('express-validator');

app.use(bodyParser.json());
app.use(expressValidator());
const FilmRoutes = require("./routes/FilmRoutes");
const CinemaRoutes = require("./routes/CinemaRoutes");

new FilmRoutes(app);
new CinemaRoutes(app);

console.log("Le serveur web démarre.");

app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log("Le serveur écoute sur le port: " + process.env.PORT);
});
