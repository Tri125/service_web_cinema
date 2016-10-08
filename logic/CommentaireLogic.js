//Fichier contenant la logique complexe de la resource Commentaire.

const connexion = require('../helpers/database');
const utils = require('../helpers/utils');

const QueryHelper = require('../helpers/queries');
const queries = new QueryHelper();

//Classe CommentaireLogic
module.exports = class CommentaireLogic {
    
    //Fonction linking qui remplace les uuid par des urls.
    //Prend un paramètre l'uuid du film associé au commentaire, ainsi qu'un objet commentaire.
    linking(uuidFilm, commentaire) {
        commentaire.url = utils.baseUrl + "/films/" + uuidFilm + "/commentaires/" + commentaire.uuid;
        commentaire.film = {};
        commentaire.film.url = utils.baseUrl + "/films/" + uuidFilm;
        //Retire les id/uuid.
        delete commentaire.idFilm;
        delete commentaire.idCommentaire;
        delete commentaire.uuid;
    }
    
    //Fonction spécifiant la logique pour la vue par défaut.
    //Prend en paramètre l'uuid du film associé, ainsi qu'un objet commentaire.
    defaultView(uuidFilm, commentaire) {
        //Rien de spécial, juste le linking.
        this.linking(uuidFilm, commentaire);
    }
    
    //Fonction spécifiant la logique pour la vue link.
    //Prend en paramètre l'uuid du film associé, ainsi qu'un objet commentaire.
    linkView(uuidFilm, commentaire) {
        //Applique le linking.
        this.linking(uuidFilm, commentaire);
        //Retire tout sauf commentaire.url.
        delete commentaire.note;
        delete commentaire.auteur;
        delete commentaire.dateHeure;
        delete commentaire.texte;
        delete commentaire.film;
    }
    
    //Fonction qui applique une vue à un objet commentaire.
    //Prend en paramètre un string spécifiant la vue désiré, l'uuid du film associé au commentaire et un objet commentaire.
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

    //Récupère un commentaire à partir de son uuid. La réponse dans un callback.
    //Prend en paramètre l'uuid du commentaire, le uuid du film associé (pour aider à appliquer la vue) et callback.
    retrieve(uuid, filmUuid, view, callback) {
        let query = queries.selectCommentaire(uuid);
        //Envoie la requête au serveur bd.
        connexion.query(query, (error, rows, fields) => {
            //Objet de réponse.
            let result = {};
            if (error) {
                //Dans le cas d'un erreur on l'enregistre dans le réponse.
                result.error = error;
            } else if (rows.length === 0) {
                result.length = 0;
            } else {
                //Enregistre le commentaire et applique la vue.
                result.commentaire = rows[0];
                this.applyView(view, filmUuid, result.commentaire);
            }
            callback(result);
        });        
    }
    
    //Récupère les commentaires associé à un film avec la vue par défaut.
    //Prend en paramètre l'uuid du film, int limit et offset pour la pagination et callback.
    retrieveFromFilm(filmUuid, limit = null, offset = null, callback) {
        //On applique la vue par défaut avec .
        this.retrieveView(filmUuid, 'default', limit, offset, (result) => {
            callback(result);
        });
    }

    //Fonction qui récupère les commentaires associé à un film en leur appliquant une vue.
    //Prend en paramètre l'uuid du film associé aux commentaires, string du nom de la vue, int limit et offset pour la pagination et callback.
    retrieveView(filmUuid, view, limit = null, offset = null, callback) {
        let query = queries.selectFilmCommentaires(filmUuid, limit, offset);
        
        //Exécution de la query.
        connexion.query(query, (error, rows, fields) => {
            //Objet de réponse.
            let result = {};
            //Liste de commentaires.
            result.commentaires = [];
            if (error) {
                //Dans le cas d'une erreur bd on enregistre l'erreur.
                result.error = error;
            } else if (rows.length === 0) {
                //S'il n'y a pas de commentaires. Utile pour envoyer une réponse vide.
                result.length = 0;
            } else {
                for (let commentaire in rows) {
                    //Applique les vues et enregistre le commentaire dans la liste.
                    this.applyView(view, filmUuid, rows[commentaire]);
                    result.commentaires.push(rows[commentaire]);
                }
            }
            callback(result);
        });
    }
};