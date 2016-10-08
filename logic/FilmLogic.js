//Fichier contenant la logique complexe de la resource Film.

const connexion = require('../helpers/database');
const utils = require('../helpers/utils');
const async = require("async");

const CommentaireLogic = require("../logic/CommentaireLogic");
const commentaireLogic = new CommentaireLogic();

const QueryHelper = require('../helpers/queries');
const queries = new QueryHelper();

//Classe FilmLogic
module.exports = class FilmLogic {
    
    //Fonction pour remplacer les id/uuid par des urls.
    //Prend en paramètre un objet film.
    linking(film) {
        film.url = utils.baseUrl + "/films/" + film.uuid;

        //Enlève les id/uuid.
        delete film.idFilm;
        delete film.uuid;
    }
    
    //Fonction pour rajouter une liste de commentaires à un film.
    //Prend en paramètre un objet film et une liste d'objets commentaires.
    //TODO: L'enlever.
    addCommentaires(film, commentaires) {
        film.commentaires = commentaires;
    }
    
    //Fonction pour récupérer un film à partir de son uuid.
    //Prend en paramètre l'uuid du film recherché et callback.
    retrieve(uuid, callback) {
        let query = queries.selectFilm(uuid);
        
        connexion.query(query, (error, rows, fields) => {
            //Objet de réponse.
            let result = {};
            
            if (error) {
                //S'il y a une erreur avec la requête.
                result.error = error;
            } else if (rows.length === 0) {
                result.length = 0;
            } else {
                //Enregistre le film dans la réponse et fait le linking.
                result.film = rows[0];
                this.linking(result.film);
            }
            
            callback(result);
        });
    }
    
    //Fonction pour prendre en charge le param url fields.
    //Retire d'un objet film tout les champs qui n'est pas demandé.
    //Prend en paramètre un objet film, une liste de string fields contenant tout les fields demandés et callback.
    handleFields(film, fields, callback) {
        //Explication de la magie:
        //Javascript passe tout par valeur, mais on peux opérer directement sur les champs d'un objet.
        //ie: enlever un champ, changer la valeur d'un champ.
        //Par contre, on ne peux pas réassigner un objet passé en paramètre dans une fonction.
        //ie: Si on envoie film dans une fonction on ne peux pas le réassigner à un nouveau objet film bien construit.
        //Conclusion: Il faut faire travailler sur une copie et transférer le résultat un à un sur le même objet.
        
        //La plus simple façon de faire un clone dans javascript à ma connaissance.
        //Transforme l'objet cinema en string et le re sérialize dans un nouveau objet json.
        let filmCopy = (JSON.parse(JSON.stringify(film)));
        //Retire tout les champs de film.
        this.deleteAll(film);
        
        //Appel async itératif pour chaque champ de fields.
        async.each(fields, function HandleFilm(field, next) {
            //Switch pour copier le champ désiré dans film.
            switch (field) {
                case 'titre':
                    film.titre = filmCopy.titre;
                    break;
                case 'pays':
                    film.pays = filmCopy.pays;
                    break;
                case 'genre':
                    film.genre = filmCopy.genre;
                    break;
                case 'classe':
                    film.classe = filmCopy.classe;
                    break;
                case 'duree':
                    film.duree = filmCopy.duree;
                    break;
                case 'realisateur':
                    film.realisateur = filmCopy.realisateur;
                    break;
                case 'imageUrl':
                    film.imageUrl = filmCopy.imageUrl;
                    break;
                case 'url':
                    film.url = filmCopy.url;
                    break;
                case 'commentaires':
                    film.commentaires = filmCopy.commentaires;
                    break;
                default:
                    break;
            }
            next();
        }, function End() {
            callback(film);
        });
    }
    
    
    //Fonction qui supprime tout les champs de l'objet film.
    //Prend en paramètre un objet film.    
    deleteAll(film) {
        for (var key in film) {
            delete film[key];
        }
    }
    
    //Fonction pour récupérer les commentaires (en vue link) d'un film à partir de son uuid.
    //Prend en paramètre un objet film et callback.
    retrieveCommentaires(film, callback) {
       commentaireLogic.retrieveView(film.uuid, 'link', null, null, (resultCommentaire) => {
           if (resultCommentaire.error) {
               //Gestion
            } else {
                //Rajout d'une liste de commentaires à l'objet film.
                this.addCommentaires(film, resultCommentaire.commentaires);
                
            }
           callback(film);
       });
    }
    
    //Fonction pour pour gérer une mise à jour partiel d'un objet film dans la base de données.
    //Prend en paramètre un objet film et callback.
    handlePatch(film, callback) {
        let uuid = film.uuid;
        let query = queries.patchFilm(uuid, film);
        
        //Exécute la requête en bd.
        connexion.query(query, (error, patchResult) => {
            //Objet de réponse.
            let result = {};
            
            //Dans le cas où la modification échoue.
            if (error) {
                result.error = error;
                callback(result);
            } else {
                //Il est plus simple de faire une nouvelle requête pour récupérer le même film pour donner la représentation au client.
                //Ne s'applique pas dans une bd où il y a de la propagation.
                this.retrieve(uuid, (resultFilm) => {
                    if (resultFilm.error) {
                        result.error = resultFilm.error;
                        callback(result);
                    } else if (resultFilm.length === 0) {
                        //Ne devrait pas se produire.
                        result.error = "Le film n'existe pas.";
                        callback(result);
                    } else {
                        //Enregistre l'objet film dans une variable locale.
                        let filmResponse = resultFilm.film;
                        //Récupère les commentaires du film et applique la vue link.
                        commentaireLogic.retrieveView(uuid, 'link', null, null, (resultCommentaire) => {
                            if (resultCommentaire.error) {
                                //Gestion
                            } else {
                                //Rajoute une liste d'objet commentaires au film.
                                this.addCommentaires(filmResponse, resultCommentaire.commentaires);
                            }
                            //Enregistre le film dans l'objet de réponse.
                            result.film = filmResponse;
                            callback(result);
                            
                        });
                    }
                });
            }
        });
    }
};