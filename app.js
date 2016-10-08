//Include du serveur web
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
//Include du validateur. Utilisé pour validé le format des données envoyés par POST/PUT/PATCH.
var expressValidator = require('express-validator');

//Sert du contenu statique du fichier interne /public disponible à l'adresse statique localhost/static.
app.use('/static', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(expressValidator());

//Include des routes de nos ressources.
const FilmRoutes = require("./routes/FilmRoutes");
const CinemaRoutes = require("./routes/CinemaRoutes");

new FilmRoutes(app);
new CinemaRoutes(app);

console.log("Le serveur web démarre.");

app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log("Le serveur écoute sur le port: " + process.env.PORT);
});
