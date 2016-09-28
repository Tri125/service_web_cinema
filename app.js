var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
const FilmRoutes = require("./routes/FilmRoutes");
const CinemaRoutes = require("./routes/CinemaRoutes");

new FilmRoutes(app);
new CinemaRoutes(app);

console.log("Le serveur web démarre.");

app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log("Le serveur écoute sur le port: " + process.env.PORT);
});