//Fichier de route de la resource Cinema.

const uuid = require("node-uuid");
const Route = require('../core/Routes');
const async = require('async');
const connexion = require('../helpers/database');

const QueryHelper = require('../helpers/queries');
const queries = new QueryHelper();

const CinemaLogic = require("../logic/CinemaLogic");
const cinemaLogic = new CinemaLogic();

const HoraireLogic = require("../logic/HoraireLogic");
const horaireLogic = new HoraireLogic();

const validationCinema = require('../validation/cinema');

//Classe CinemaRoutes enfant de Route
class CinemaRoutes extends Route {
    constructor(app) {
        super(app);
        //Rajoute tout les handlers avec les routes de la resource cinema à l'application express.
        app.post('/cinemas/', this.post);
        app.get('/cinemas/', this.getAll);
        app.put('/cinemas/:uuid', this.put);
        app.get('/cinemas/:uuid', this.get);
        app.get('/cinemas/:uuid/horaires/', this.getHoraires);
    }
    
    //Handler post sur la resource cinema.
    post(req, res) {
        //Réponse de base.
        super.createResponse(res);
        
        let isBody = true;
        //Body pour savoir si on veut retourner une représentation de l'objet au client une fois rajouté.
	    if (req.query._body && req.query._body === 'false') {
	        isBody = false;
	    }
        //Exécute les règles de validation de l'objet cinema.
        req.checkBody(validationCinema.Required());
        //Vérifie si une erreur de validation c'est produite.
        var errorValidation = req.validationErrors();
        if (errorValidation) {
            //Erreur de validation.
            res.status(500);
            let error = super.createError(500, "Erreur de validation", errorValidation);
            res.send(error);
            return;
        }
        //Crée un nouveau uuid v4.
        req.body.uuid = uuid.v4();
        let query = queries.insertCinema(req.body);
        
        //Exécute la requête en bd.
        connexion.query(query, (error, result) => {
            if (error) {
                res.status(500);
                let errorMessage = super.createError(500, "Erreur de Serveur", error);
                res.send(errorMessage);
            } else {
                //Réutilise le même body de la requête client pour envoyer une représentation de l'objet créé.
                cinemaLogic.linking(req.body);
                //Crée une collection vide d'horaires.
                req.body.horaires = [];
                res.status(201);
                res.location(req.body.url);
                //Techniquement on ne devrait pas travailler pour rien et faire ce if plus tôt.
                if (isBody) {
                    res.send(req.body);  
                } else {
                    res.send();
                }
            }
            
        });
        

    }
    
    //Handler get sur la collection cinema
    getAll(req, res) {
        //Réponse de base.
        super.createResponse(res);

        let query = queries.selectCinemas(null, null);
        
        //Exécute la requête en bd.
        connexion.query(query, (error, rows, fields) => {
            if (error) {
                res.status(500);
                let errorResponse = super.createError(500, "Erreur Serveur", error);
                res.send(errorResponse);
            } else {
                res.status(200);
                //Async itératif sur tout les cinéma retourné par la bd.
                async.each(rows, (cinema, next) => {
                    let uuid = cinema.uuid;
                    cinemaLogic.linking(cinema);
                    //Récupère tout les horaires du cinema. et applique la vue link.
                    horaireLogic.retrieveView(uuid, 'link', null, null, (resultHoraire) => {
                        if (resultHoraire.error) {
                            //Gestion
                        } else {
                            //Rajoute une liste d'objet horaires au cinema.
                            cinemaLogic.addHoraires(cinema, resultHoraire.horaires);
                        }
                        next();
                    });
                }, function SendResponse() {
                    res.send(rows);
                });
            }
        });
    }
    
    //Handler put de la resource cinema.
    put(req, res) {
        //Réponse de base.
        super.createResponse(res);
        
        //Lance les règles de validation d'un objet cinema.
        req.checkBody(validationCinema.Required());
        //Vérifie si une erreur de validation c'est produite.
        var errorValidation = req.validationErrors();
        if (errorValidation) {
            //Erreur de validation.
            res.status(500);
            let error = super.createError(500, "Erreur de validation", errorValidation);
            res.send(error);
            return;
        }
        //Plus simple à travailler si l'objet lui même contient l'uuid de la requête.
        req.body.uuid = req.params.uuid;
        
        //Fait la mise à jour complète de l'objet cinema en bd et récupère une représentation.
        cinemaLogic.handlePut(req.body, (result) => {
            if (result.error) {
                res.status(500);
                let errorResponse = super.createError(500, "Erreur Serveur", result.error);
                res.send(errorResponse);
            } else {
                res.status(200);
                res.send(result.cinema);
            }
        });
    }
    
    //Handler get sur la resource cinema.
    get(req, res) {
        //Réponse de base.
        super.createResponse(res);
        let fields = null;
        
        //Fields
	    if (req.query.fields) {
	        fields = req.query.fields;
	        //Prépare la chaîne string en séparant les éléments séparé par une virgule un à un.
	        //Enregistre la liste de string résultante.
	        fields = super.prepareFields(fields);
	    }
        
        //Récupère l'objet cinema en bd à partir de son uuid.
        cinemaLogic.retrieve(req.params.uuid, (result) => {
            if (result.error) {
                res.status(500);
                let errorResponse = super.createError(500, "Erreur Serveur", result.error);
                res.send(errorResponse);
            } else if (result.length === 0) {
                res.status(404);
                res.send();
            } else {
                res.status(200);
                let cinemaResponse = result.cinema;
                //Récupère les horaires du cinema et applique la vue link.
                horaireLogic.retrieveView(req.params.uuid, 'link', null, null, (resultHoraire) => {
                    if (resultHoraire.error) {
                        //Gestion
                    } else {
                        cinemaLogic.addHoraires(cinemaResponse, resultHoraire.horaires);
                    }
                    //Si fields est utilisé
                    if (fields) {
                        //Applique fields en filtrant les champs de l'objet cinema qui n'intéresse pas le client.
                        cinemaLogic.handleFields(cinemaResponse, fields, (cinemaResponse) => {
                            res.send(cinemaResponse);
                        });
                    } else {
                        res.send(cinemaResponse);
                    }
                });
            }
        });
    }
    
    //Handler get des horaires de la resource cinema.
    getHoraires(req, res) {
        //Réponse de base.
        super.createResponse(res);
        
        //Récupère les horaires du cinema spécifié par uuid en appliquant la vue default.
        horaireLogic.retrieveView(req.params.uuid, 'default', null, null, (result) => {
           if (result.error) {
               res.status(500);
               let errorResponse = super.createError(500, "Erreur Serveur", result.error);
               res.send(errorResponse);
           } else if (result.length === 0) {
               res.status(404);
               res.send();
           } else {
               res.status(200);
               res.send(result.horaires);
           }
       });
    }
}

module.exports = CinemaRoutes;