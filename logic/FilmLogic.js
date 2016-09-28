const connexion = require('../helpers/database');
const utils = require('../helpers/utils');
const async = require("async");

const CommentaireLogic = require("../logic/CommentaireLogic");
const commentaireLogic = new CommentaireLogic();

const QueryHelper = require('../helpers/queries');
const queries = new QueryHelper();

module.exports = class FilmLogic {
    
    linking(film) {
        film.url = utils.baseUrl + "/films/" + film.uuid;

        delete film.idFilm;
        delete film.uuid;
    }
    
    addCommentaires(film, commentaires) {
        film.commentaires = commentaires;
    }
    
    retrieve(fields, uuid, callback) {
        //TODO: Fields logic
        
        let query = queries.selectFilm(uuid, fields);
        
        connexion.query(query, (error, rows, fields) => {
            let result = {};
            
            if (error) {
                result.error = error;
            } else if (rows.length === 0) {
                result.length = 0;
            } else {
                result.film = rows[0];
                this.linking(result.film);
            }
            
            callback(result);
        });
    }
    
    handleFields(film, fields, callback) {
        let filmResponse = {};
        
        async.each(fields, function HandleFilm(field, next) {
            switch (field) {
                case 'titre':
                    filmResponse.titre = film.titre;
                    break;
                case 'pays':
                    filmResponse.pays = film.pays;
                    break;
                case 'genre':
                    filmResponse.genre = film.genre;
                    break;
                case 'classe':
                    filmResponse.classe = film.classe;
                    break;
                case 'duree':
                    filmResponse.duree = film.duree;
                    break;
                case 'realisateur':
                    filmResponse.realisateur = film.realisteur;
                    break;
                case 'imageUrl':
                    filmResponse.imageUrl = film.imageUrl;
                    break;
                case 'url':
                    filmResponse.url = film.url;
                    break;
                case 'commentaires':
                    filmResponse.commentaires = film.commentaires;
                    break;
                default:
                    break;
            }
            next();
        }, function End() {
            callback(filmResponse);
        });
    }
    
    retrieveCommentaires(film, callback) {
       commentaireLogic.retrieveView(film.uuid, 'link', (resultCommentaire) => {
           if (resultCommentaire.error) {
               //Gestion
            } else {
                this.addCommentaires(film, resultCommentaire.commentaires);
                
            }
           callback(film);
       });
    }
}