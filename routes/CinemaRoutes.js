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

class CinemaRoutes extends Route {
    constructor(app) {
        super(app);
        app.post('/cinemas/', this.post); // TODO
        app.get('/cinemas/', this.getAll);
        app.put('/cinemas/:uuid', this.put); // TODO
        app.get('/cinemas/:uuid', this.get);
        app.get('/cinemas/:uuid/horaires/', this.getHoraires); // TODO
    }
    
    post(req, res) {
        super.createResponse(res);
        
        let isBody = true;
        //Body
	    if (req.query._body && req.query._body === 'false') {
	        isBody = false;
	    }
        
        req.checkBody(validationCinema.Required());
        var errorValidation = req.validationErrors();
        if (errorValidation) {
            res.status(500);
            let error = super.createError(500, "Erreur de validation", errorValidation);
            res.send(error);
            return;
        }
        req.body.uuid = uuid.v4();
        let query = queries.insertCinema(req.body);
        
        connexion.query(query, (error, result) => {
            if (error) {
                res.status(500);
                let errorMessage = super.createError(500, "Erreur de Serveur", error);
                res.send(errorMessage);
            } else {
                cinemaLogic.linking(req.body);
                req.body.horaires = [];
                res.status(201);
                res.location(req.body.url);
                if (isBody) {
                    res.send(req.body);  
                } else {
                    res.send();
                }
            }
            
        });
        

    }
    
    getAll(req, res) {
        super.createResponse(res);

        let query = queries.selectCinemas('*', null, null);
        
        connexion.query(query, (error, rows, fields) => {
            if (error) {
                res.status(500);
                let errorResponse = super.createError(500, "Erreur Serveur", error);
                res.send(errorResponse);
            } else {
                res.status(200);
                async.each(rows, (cinema, next) => {
                    let uuid = cinema.uuid;
                    cinemaLogic.linking(cinema);
                    horaireLogic.retrieveView(uuid, 'link', null, null, (resultHoraire) => {
                        if (resultHoraire.error) {
                            //Gestion
                        } else {
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
    
    put(req, res) {
        super.createResponse(res);
        
        req.checkBody(validationCinema.Required());
        var errorValidation = req.validationErrors();
        if (errorValidation) {
            res.status(500);
            let error = super.createError(500, "Erreur de validation", errorValidation);
            res.send(error);
            return;
        }
        
        cinemaLogic.handlePut(req.params.uuid, req.body, (result) => {
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
    
    get(req, res) {
        super.createResponse(res);
        let fields = null;
        
        //Fields
	    if (req.query.fields) {
	        fields = req.query.fields;
	        fields = super.prepareFields(fields);
	    }
        
        cinemaLogic.retrieve('*', req.params.uuid, (result) => {
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
                horaireLogic.retrieveView(req.params.uuid, 'link', null, null, (resultHoraire) => {
                    if (resultHoraire.error) {
                        //Gestion
                    } else {
                        cinemaLogic.addHoraires(cinemaResponse, resultHoraire.horaires);
                    }
                    if (fields) {
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
    
    getHoraires(req, res) {
        super.createResponse(res);
        
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