const uuid = require("node-uuid");
const async = require('async');

const validationFilm = require('../validation/film');
const validationCommentaire = require('../validation/commentaire');

const Route = require('../core/Routes');
const connexion = require('../helpers/database');

const FilmLogic = require("../logic/FilmLogic");
const filmLogic = new FilmLogic();

const QueryHelper = require('../helpers/queries');
const queries = new QueryHelper();

const CommentaireLogic = require("../logic/CommentaireLogic");
const commentaireLogic = new CommentaireLogic();


class FilmRoutes extends Route {

    constructor(app) {
        super(app);
        app.post('/films/',this.postFilm);
        app.get('/films/', this.getAll);
        app.get('/films/:uuidFilm', this.get);
        app.patch('/films/:uuidFilm', this.patch);
        app.delete('/films/:uuidFilm', this.deleteFilm);
        app.get('/films/:uuidFilm/commentaires/', this.getComms);
        app.post('/films/:uuidFilm/commentaires/', this.postComm);
        app.delete('/films/:uuidFilm/commentaires/:uuidCommentaire', this.delComm);
    }
    
    postFilm(req, res) {
        super.createResponse(res);
        req.checkBody(validationFilm.Required());
        var errorValidation = req.validationErrors();
        if (errorValidation) {
            res.status(500);
            let error = super.createError(500, "Erreur de validation", errorValidation);
            res.send(error);
            return;
        }
        req.body.uuid = uuid.v4();
        let filmQuery = queries.insertFilm(req.body);
        
        connexion.query(filmQuery, (error, result) => {
            if (error) {
                res.status(500);
                let errorMessage = super.createError(500, "Erreur de Serveur", error);
                res.send(errorMessage);
            } else {
                filmLogic.linking(req.body);
                res.status(201);
                res.location(req.body.url);
                res.send(req.body);                
            }
            
        });
        

    }
    
    getAll(req, res) {
        super.createResponse(res);
        let offset = null;
        let limit = null;
        let fieldsParam = null;
        
        //Fields
	    if (req.query.fields) {
	        fieldsParam = req.query.fields;
	        fieldsParam = super.prepareFields(fieldsParam);
	    }

        //Pagination
        if (req.query.offset && req.query.limit) {
            if (super.validateLimitOffset(req.query.limit,req.query.offset) ){
                offset = req.query.offset;
                limit = req.query.limit;
            }
        }
        
	    let viewCommentaires = 'link';
        
        if (req.query.expand && req.query.expand === 'commentaires') {
            viewCommentaires = 'default';
        }
        
        let filmsQuery = queries.selectFilms('*', limit, offset);

        connexion.query(filmsQuery, (error, rows, fields) => {
            if (error) {
                res.status(500);
                let errorResponse = super.createError(500, "Erreur Serveur", error);
                res.send(errorResponse);
            } else {
                res.status(200);
                async.each(rows, function HandleFilm(film, next) {
                    let uuid = film.uuid;
                    filmLogic.linking(film);
                    commentaireLogic.retrieveView(uuid, viewCommentaires, null, null, (resultCommentaire) => {
                        if (resultCommentaire.error) {
                            //Gestion
                        } else {
                            filmLogic.addCommentaires(film, resultCommentaire.commentaires);
                        }
                        let filmCopy = film;
                        if (fieldsParam) {
                            filmLogic.handleFields(filmCopy, fieldsParam, (film) => {
                                console.log(film);
                                next();
                            });
                        } else {
                            next();
                        }
                    });
                }, function SendResponse() {
                    res.send(rows);
                });
            }
        });
    }
    
    get(req, res) {
        super.createResponse(res);
        
	    let fields = null;
	    if (req.query.fields) {
	        fields = req.query.fields;
	        fields = super.prepareFields(fields);
	    }
	    
	    
	    let viewCommentaires = 'link';
        
        if (req.query.expand && req.query.expand === 'commentaires') {
            viewCommentaires = 'default';
        }
        
        filmLogic.retrieve('*', req.params.uuidFilm, (result) => {
            if (result.error) {
                res.status(500);
                let errorResponse = super.createError(500, "Erreur Serveur", result.error);
                res.send(errorResponse);
            } else if (result.length === 0) {
                res.status(404);
                res.send();
            } else {
                res.status(200);
                let filmResponse = result.film;
                commentaireLogic.retrieveView(req.params.uuidFilm, viewCommentaires, null, null, (resultCommentaire) => {
                    if (resultCommentaire.error) {
                        //Gestion
                    } else {
                        filmLogic.addCommentaires(filmResponse, resultCommentaire.commentaires);
                    }
                    if (fields) {
                        filmLogic.handleFields(filmResponse, fields, (filmResponse) => {
                            res.send(filmResponse);
                        });
                    } else {
                        res.send(filmResponse);
                    }
                });
            }
        });
    }
    
    patch(req, res) {
        super.createResponse(res);
        req.checkBody(validationFilm.Optional());
        var errorValidation = req.validationErrors();
        if (errorValidation) {
            res.status(500);
            let error = super.createError(500, "Erreur de validation", errorValidation);
            res.send(error);
            return;
        }
        filmLogic.handlePatch(req.params.uuidFilm, req.body, (result) => {
            if (result.error) {
                res.status(500);
                let errorResponse = super.createError(500, "Erreur Serveur", result.error);
                res.send(errorResponse);
            } else {
                res.status(200);
                res.send(result.film);
            }
        });
        
    }
    
    deleteFilm(req, res) {
        super.createResponse(res);
        let filmsQuery = queries.deleteFilm(req.params.uuidFilm);

        connexion.query(filmsQuery, (error, rows) => {
            if (error) {
                res.status(500);
                let errorResponse = super.createError(500, "Erreur Serveur", error);
                res.send(errorResponse);
            } else {
                res.status(204);
                res.send();
            }
        });
        
    }
    
    getComms(req, res) {
        super.createResponse(res);
        let offset = null;
        let limit = null;
        
        //Pagination
        if (req.query.offset && req.query.limit) {
            if (super.validateLimitOffset(req.query.limit,req.query.offset) ){
                offset = req.query.offset;
                limit = req.query.limit;
            }
        }
        
       commentaireLogic.retrieveFromFilm(req.params.uuidFilm, limit, offset, (result) => {
           if (result.error) {
               res.status(500);
               let errorResponse = super.createError(500, "Erreur Serveur", result.error);
               res.send(errorResponse);
            } else {
                res.status(200);
                res.send(result.commentaires);
            }
       });
    }

    postComm(req, res) {
        super.createResponse(res);
        req.checkBody(validationCommentaire.Required());
        var errorValidation = req.validationErrors();
        if (errorValidation) {
            res.status(500);
            let error = super.createError(500, "Erreur de validation", errorValidation);
            res.send(error);
            return;
        }
        req.body.uuid = uuid.v4();
        req.body.filmUuid = req.params.uuidFilm;
        let commentaireQuery = queries.insertCommentaire(req.body);
        
        connexion.query(commentaireQuery, (error, result) => {
            if (error) {
                res.status(500);
                let errorMessage = super.createError(500, "Erreur de Serveur", error);
                res.send(errorMessage);
            } else {
                commentaireLogic.retrieve(req.body.uuid, req.params.uuidFilm, 'default', (result) => {
                    if (result.error) {
                        res.status(500);
                        let errorMessage = super.createError(500, "Erreur de Serveur", error);
                        res.send(errorMessage);
                    } else {
                        res.status(201);
                        res.location(result.commentaire.url);
                        res.send(result.commentaire);   
                    }
                });
            }
            
        });
    }
    
    delComm(req, res) {
        super.createResponse(res);
        
        let commentaireQuery = queries.deleteCommentaire(req.params.uuidCommentaire);
        
        connexion.query(commentaireQuery, (error, rows) => {
            if (error) {
               res.status(500);
               let errorResponse = super.createError(500, "Erreur Serveur", error);
               res.send(errorResponse);
            } else {
                res.status(204);
                res.send();
            }
        });
    }
}

module.exports = FilmRoutes;