const uuid = require("node-uuid");
const async = require('async');

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
        app.post('/films/', this.postFilm); // TODO 
        app.get('/films/', this.getAll); // TODO
        app.get('/films/:uuidFilm', this.get); // TODO
        app.patch('/films/:uuidFilm', this.patchFilm); // TODO
        app.delete('/films/:uuidFilm', this.deleteFilm); // TODO
        app.get('/films/:uuidFilm/commentaires/', this.getComms); // TODO
        app.post('/films/:uuidFilm/commentaires/', this.postComm); // TODO
        app.delete('/films/:uuidFilm/commentaires/:uuidCommentaire', this.delComm); // TODO
    }
    
    postFilm(req, res) {
        let error = super.createError(501, "Erreur Serveur", "Not Implemented");
        res.send(error);
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
            offset = req.query.offset;
            limit = req.query.limit;
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
                    commentaireLogic.retrieveView(uuid, viewCommentaires, (resultCommentaire) => {
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
                res.status(500)
                let errorResponse = super.createError(500, "Erreur Serveur", result.error);
                res.send(errorResponse);
            } else if (result.length === 0) {
                res.status(404);
                res.send();
            } else {
                res.status(200);
                let filmResponse = result.film;
                commentaireLogic.retrieveView(req.params.uuidFilm, viewCommentaires, (resultCommentaire) => {
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
    
    patchFilm(req, res) {
        let error = super.createError(501, "Erreur Serveur", "Not Implemented");
        res.send(error)
        
    }
    
    deleteFilm(req, res) {
        let error = super.createError(501, "Erreur Serveur", "Not Implemented");
        res.send(error)
        
    }
    
    getComms(req, res) {
        super.createResponse(res);
        let offset = null;
        let limit = null;
        
        //Pagination
        if (req.query.offset && req.query.limit) {
            offset = req.query.offset;
            limit = req.query.limit;
        }
        
        let commentairesQuery = queries.selectFilms(null, offset, limit);
        
        connexion.query(commentairesQuery, (error, rows, fields) => {
            if (error) {
                res.status(500);
                let errorResponse = super.createError(500, "Erreur Serveur", error);
                res.send(errorResponse);
            } else if (true){ //TODO
                res.status(200);
                
            }
        });
        
        let error = super.createError(501, "Erreur Serveur", "Not Implemented");
        res.send(error)
        
    }

    postComm(req, res) {
        let error = super.createError(501, "Erreur Serveur", "Not Implemented");
        res.send(error)
        
    }
    
    delComm(req, res) {
        let error = super.createError(501, "Erreur Serveur", "Not Implemented");
        res.send(error)
        
    }
}

module.exports = FilmRoutes;