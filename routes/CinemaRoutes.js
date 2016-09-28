const uuid = require("node-uuid");
const Route = require('../core/Routes');
const async = require('async');
const connexion = require('../helpers/database');

const QueryHelper = require('../helpers/queries');
const queries = new QueryHelper();

class CinemaRoutes extends Route {
    // VAR
    // ---
    // app : Référence à l'application.
    
    constructor(app) {
        super(app);
        app.post('/cinemas/', this.postCinema); // TODO
        app.get('/cinemas/', this.getCinemas);
        app.put('/cinemas/:uuid', this.putCinema); // TODO
        app.get('/cinemas/:uuid', this.getCinema);
        app.get('/cinemas/:uuid/horaires/', this.getHoraires); // TODO
    }
    
    postCinema(req, res) {
        let error = super.createError(501, "Erreur Serveur", "Not Implemented");
        res.send(error);
    }
    
    getCinemas(req, res) {
        super.createResponse(res);
        let offset = null;
        let limit = null;
        let fields = null;
        let expand = false;
        
        //Fields
        if (req.query.fields) {
            fields = req.query.fields;
        }
        
        //Pagination
        if (req.query.offset) {
            offset = req.query.offset;
        }
        
        if (req.query.limit) {
            limit = req.query.limit;
        }
        
        // Expand
        if (req.query.expand)
            expand = req.query.expand;
        
        let cinemasQuery = sqlcmds.SelectCinemas(fields, limit, offset);
        
         //TODO: Expand
        connexion.Connection().query(cinemasQuery, (error, rows, badFields) => {
            if (error) {
                res.status(500);
                let errorResponse = super.createError(500, "Erreur Serveur", error);
                res.send(errorResponse);
            } else {
                res.status(200);
                async.eachSeries(rows, (cinema, nextgc) => {
                    CinemaLogic.linking(cinema, (result) => {
                        nextgc();
                    }, fields, false, false, expand);
                }, () => {
                    res.send(rows);
                });
            }
        });
    }
    
    putCinema(req, res) {
        let error = super.createError(501, "Erreur Serveur", "Not Implemented");
        res.send(error);
    }
    
    getCinema(req, res) {
        super.createResponse(res);
        let offset = null;
        let limit = null;
        let fields = null;
        let expand = false;
        let uuid = req.params.uuid;
        
        //Fields
        if (req.query.fields) {
            fields = req.query.fields;
        }
        
        //Pagination
        if (req.query.offset) {
            offset = req.query.offset;
        }
        
        if (req.query.limit) {
            limit = req.query.limit;
        }
        
        // Expand
        if (req.query.expand)
            expand = req.query.expand;
        
        let cinemaQuery = sqlcmds.SelectCinema(uuid, fields, limit, offset);
        
         //TODO: Expand
        connexion.Connection().query(cinemaQuery, (error, rows, badFields) => {
            if (error) {
                res.status(500);
                let errorResponse = super.createError(500, "Erreur Serveur", error);
                res.send(errorResponse);
            } else {
                res.status(200);
                CinemaLogic.linking(rows[0], (result) => {
                    res.send(rows[0]);
                }, fields, false, false, expand);
            }
        });
    }
    
    getHoraires(req, res) {
        super.createResponse(res);
        let offset = null;
        let limit = null;
        let fields = null;
        let expand = false;
        
        //Fields
        if (req.query.fields) {
            fields = req.query.fields;
        }
        
        //Pagination
        if (req.query.offset) {
            offset = req.query.offset;
        }
        
        if (req.query.limit) {
            limit = req.query.limit;
        }
        
        // Expand
        if (req.query.expand)
            expand = req.query.expand;
        
        let horairesQuery = sqlcmds.SelectHoraires(req.params.uuid, fields, limit, offset);
        
         //TODO: Expand
        connexion.Connection().query(horairesQuery, (error, rows, badFields) => {
            if (error) {
                res.status(500);
                let errorResponse = super.createError(500, "Erreur Serveur", error);
                res.send(errorResponse);
            } else {
                res.status(200);
                async.eachSeries(rows, (horaire, next) => {
                    HoraireLogic.linking(horaire, req.params.uuid, (result) => {
                        next();
                    }, fields, false, false, expand);
                }, () => {
                    res.send(rows);
                });
            }
        });
    }
}

module.exports = CinemaRoutes;