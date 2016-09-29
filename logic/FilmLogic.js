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
        let filmCopy = (JSON.parse(JSON.stringify(film)));
        this.deleteAll(film);
        
        async.each(fields, function HandleFilm(field, next) {
            switch (field) {
                case 'titre':
                    filmResponse.titre = filmCopy.titre;
                    break;
                case 'pays':
                    filmResponse.pays = filmCopy.pays;
                    break;
                case 'genre':
                    filmResponse.genre = filmCopy.genre;
                    break;
                case 'classe':
                    filmResponse.classe = filmCopy.classe;
                    break;
                case 'duree':
                    filmResponse.duree = filmCopy.duree;
                    break;
                case 'realisateur':
                    filmResponse.realisateur = filmCopy.realisateur;
                    break;
                case 'imageUrl':
                    filmResponse.imageUrl = filmCopy.imageUrl;
                    break;
                case 'url':
                    filmResponse.url = filmCopy.url;
                    break;
                case 'commentaires':
                    filmResponse.commentaires = filmCopy.commentaires;
                    break;
                default:
                    break;
            }
            next();
        }, function End() {
            for (let key in filmResponse) {
                film[key] = filmResponse[key];
            }
            callback(film);
        });
    }
    
    deleteAll(film) {
        delete film.commentaires;
        delete film.url;
        delete film.imageUrl;
        delete film.realisateur;
        delete film.duree;
        delete film.classe;
        delete film.genre;
        delete film.pays;
        delete film.titre;
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