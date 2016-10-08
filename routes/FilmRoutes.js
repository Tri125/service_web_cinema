//Fichier pour les routes sur la resource Film

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

//Classe FilmRoutes enfant de Route
class FilmRoutes extends Route {

    constructor(app) {
        super(app);
        //Rajoute tout les handlers selon la méthode http et la route à l'application express.
        app.post('/films/',this.postFilm);
        app.get('/films/', this.getAll);
        app.get('/films/:uuidFilm', this.get);
        app.patch('/films/:uuidFilm', this.patch);
        app.delete('/films/:uuidFilm', this.deleteFilm);
        app.get('/films/:uuidFilm/commentaires/', this.getComms);
        app.post('/films/:uuidFilm/commentaires/', this.postComm);
        app.delete('/films/:uuidFilm/commentaires/:uuidCommentaire', this.delComm);
    }
    
    //Handler pour rajouter un nouveau film.
    postFilm(req, res) {
        //Réponse de base.
        super.createResponse(res);
        //Lance les règles de validations.
        req.checkBody(validationFilm.Required());
        //Vérifie si une erreur de validation c'est produit.
        var errorValidation = req.validationErrors();
        //Si oui, erreur code 500.
        if (errorValidation) {
            res.status(500);
            let error = super.createError(500, "Erreur de validation", errorValidation);
            res.send(error);
            return;
        }
        //Crée un nouveau uuid v4.
        req.body.uuid = uuid.v4();
        let filmQuery = queries.insertFilm(req.body);
        
        //Exécute la requête en bd.
        connexion.query(filmQuery, (error, result) => {
            //Dans le cas d'une erreur.
            if (error) {
                res.status(500);
                let errorMessage = super.createError(500, "Erreur de Serveur", error);
                res.send(errorMessage);
            } else {
                //Pour envoyer une représentation de l'objet au client, on prépare le même objet envoyé
                //par le client.
                //Fait le linking.
                filmLogic.linking(req.body);
                //Liste de commentaires vide car c'est un nouveau film.
                req.body.commentaires = [];
                res.status(201);
                res.location(req.body.url);
                res.send(req.body);                
            }
            
        });
        

    }
    
    //Handler GET pour la collection de films.
    getAll(req, res) {
        //Réponse de base
        super.createResponse(res);
        
        let offset = null;
        let limit = null;
        let fieldsParam = null;
        
        //Fields
        //Vérifie que le query d'url fields n'est pas null.
	    if (req.query.fields) {
	        //L'enregistre dans une variable locale.
	        fieldsParam = req.query.fields;
	        //Prépare la chaîne string en séparant les éléments séparé par une virgule un à un.
	        //Enregistre la liste de string résultante.
	        fieldsParam = super.prepareFields(fieldsParam);
	    }

        //Pagination
        //Offset et limit doivent tout les deux être utilisé pour bénéficier de la pagination.
        if (req.query.offset && req.query.limit) {
            //Si la validation passe.
            if (super.validateLimitOffset(req.query.limit,req.query.offset) ){
                //Enregistre offset et limit dans des variables locales.
                offset = req.query.offset;
                limit = req.query.limit;
            }
        }
        
        //Vue désiré des commentaires des films.
	    let viewCommentaires = 'link';
        
        //Si le query d'url expand sur commentaires est utilisé, alors on change la vue à default pour faire l'expand.
        if (req.query.expand && req.query.expand === 'commentaires') {
            viewCommentaires = 'default';
        }
        
        let filmsQuery = queries.selectFilms(limit, offset);

        //Exécute la requête bd.
        connexion.query(filmsQuery, (error, rows, fields) => {
            //Dans le cas d'une erreur.
            if (error) {
                //code http 500
                res.status(500);
                let errorResponse = super.createError(500, "Erreur Serveur", error);
                res.send(errorResponse);
            } else {
                res.status(200);
                //Async itératif sur chaque film de la réponse bd.
                async.each(rows, function HandleFilm(film, next) {
                    let uuid = film.uuid;
                    //Fait le linking du film
                    filmLogic.linking(film);
                    //Récupère les commentaires du film avec la vue spécicié.
                    commentaireLogic.retrieveView(uuid, viewCommentaires, null, null, (resultCommentaire) => {
                        if (resultCommentaire.error) {
                            //Gestion
                        } else {
                            //Rajoute la liste de commentaires au film.
                            filmLogic.addCommentaires(film, resultCommentaire.commentaires);
                        }
                        //Sa marche pas comme sa les "copies"
                        //TODO: Enlever sa
                        let filmCopy = film;
                        //Si la requête http utilise les fields
                        if (fieldsParam) {
                            //Applique la filtration des champs.
                            filmLogic.handleFields(filmCopy, fieldsParam, (film) => {
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
    
    //Handler get sur un film
    get(req, res) {
        //Réponse de base
        super.createResponse(res);
        
	    let fields = null;
	    
	    //Fields
	    if (req.query.fields) {
	        //Prépare la chaîne string en séparant les éléments séparé par une virgule un à un.
	        //Enregistre la liste de string résultante.
	        fields = req.query.fields;
	        fields = super.prepareFields(fields);
	    }
	    
	    //Vue sur les commentaires du film.
	    let viewCommentaires = 'link';
        
        //Si la query url expand est utilisé pour le champ commentaires, alors on change la vue des commentaires à default pour faire l'expand.
        if (req.query.expand && req.query.expand === 'commentaires') {
            viewCommentaires = 'default';
        }
        
        //Récupère un objet film selon l'uuid qui est un param url.
        filmLogic.retrieve(req.params.uuidFilm, (result) => {
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
                //Récupère les commentaires du film en appliquant la vue spécifié.
                commentaireLogic.retrieveView(req.params.uuidFilm, viewCommentaires, null, null, (resultCommentaire) => {
                    if (resultCommentaire.error) {
                        //Gestion
                    } else {
                        //Rajoute les commentaires au film.
                        filmLogic.addCommentaires(filmResponse, resultCommentaire.commentaires);
                    }
                    //Si fields est utilisé, alors filtre les champs de l'objet film pour garder ceux demandés.
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
    
    //Handler patch sur la resource film.
    patch(req, res) {
        //Réponse de base.
        super.createResponse(res);
        //Lance les règles de vérification sur le body reçue.
        req.checkBody(validationFilm.Optional());
        //Vérifie si une erreur de validation c'est produite.
        var errorValidation = req.validationErrors();
        if (errorValidation) {
            //Erreur de validation
            res.status(500);
            let error = super.createError(500, "Erreur de validation", errorValidation);
            res.send(error);
            return;
        }
        //Met l'uuid situé dans l'url directement dans le body pour aiser les fonctions.
        req.body.uuid = req.params.uuidFilm;
        //Fait la mise à jour partiel et récupère une représentation de l'objet.
        filmLogic.handlePatch(req.body, (result) => {
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
    
    //Handler delete sur la resource film.
    deleteFilm(req, res) {
        //Réponse de base.
        super.createResponse(res);
        let filmsQuery = queries.deleteFilm(req.params.uuidFilm);
        //Exécute la requête.
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
    
    //Handler get des commentaires de la resource film.
    getComms(req, res) {
        //Réponse de base
        super.createResponse(res);
        let offset = null;
        let limit = null;
        
        //Pagination
        //Offset et limit doivent tout les deux êtres spécifié pour utiliser la pagination.
        if (req.query.offset && req.query.limit) {
            //Valide offset et limit
            if (super.validateLimitOffset(req.query.limit,req.query.offset) ){
                offset = req.query.offset;
                limit = req.query.limit;
            }
        }
        //Récupère les commentaires d'un film à partir de l'uuid du film.
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
    
    //Handler post des commentaires de la resource film.
    postComm(req, res) {
        //Réponse de base
        super.createResponse(res);
        
        //Lance les règle de validation pour un objet commentaire.
        req.checkBody(validationCommentaire.Required());
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
        //Rajoute le uuid du film directement dans le body de la requête pour aiser les fonctions.
        req.body.filmUuid = req.params.uuidFilm;
        let commentaireQuery = queries.insertCommentaire(req.body);
        
        //Execute la requête bd.
        connexion.query(commentaireQuery, (error, result) => {
            if (error) {
                res.status(500);
                let errorMessage = super.createError(500, "Erreur de Serveur", error);
                res.send(errorMessage);
            } else {
                //Récupération du commentaire pour pouvoir donner une représentation au client.
                //Pas idéal pour une bd avec propagation.
                
                //Récupère le commentaire avec la vue default à partir l'uuid nouvellement créé.
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
    
    //Handler delete des commentaires de la resource film.
    delComm(req, res) {
        //Réponse de base.
        super.createResponse(res);
        
        let commentaireQuery = queries.deleteCommentaire(req.params.uuidCommentaire);
        
        //Exécute la requête en bd.
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