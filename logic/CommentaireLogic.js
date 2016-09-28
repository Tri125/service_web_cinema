const connexion = require('../helpers/database');
const utils = require('../helpers/utils');
const async = require("async");

const QueryHelper = require('../helpers/queries');
const queries = new QueryHelper();

module.exports = class CommentaireLogic {
    
    linking(uuidFilm, commentaire) {
        commentaire.url = utils.baseUrl + "/films/" + uuidFilm + "/commentaires/" + commentaire.uuid;
        
        delete commentaire.idFilm;
        delete commentaire.idCommentaire;
        delete commentaire.uuid;
    }
    
    defaultView(uuidFilm, commentaire) {
        this.linking(uuidFilm, commentaire);
    }
    
    linkView(uuidFilm, commentaire) {
        this.linking(uuidFilm, commentaire);
        delete commentaire.note;
        delete commentaire.auteur;
        delete commentaire.dateHeure;
        delete commentaire.texte;
    }
    
    applyView(view, uuidFilm, commentaire) {
        switch (view) {
            case 'default':
                this.defaultView(uuidFilm, commentaire);
                break;
            case 'link':
                this.linkView(uuidFilm, commentaire);
                break;
            default:
                this.defaultView(uuidFilm, commentaire);
                break;
        }
    }

    retrieve(filmUuid, callback) {
        this.retrieveView(filmUuid, 'default', (result) => {
            callback(result);
        });
    }

    retrieveView(filmUuid, view, callback) {
        let query = queries.selectFilmCommentaires(filmUuid);
        
        connexion.query(query, (error, rows, fields) => {
            let result = {};
            result.commentaires = [];
            if (error) {
                result.error = error;
            } else if (rows.length === 0) {
                result.length = 0;
            } else {
                for (let commentaire in rows) {
                    this.applyView(view, filmUuid, rows[commentaire]);
                    result.commentaires.push(rows[commentaire]);
                }
            }
            callback(result);
        });
    }
};