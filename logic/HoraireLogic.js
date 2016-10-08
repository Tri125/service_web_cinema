//Fichier contenant toute la logique complexe derrière la resource Horaire.

const connexion = require('../helpers/database');
const utils = require('../helpers/utils');

const QueryHelper = require('../helpers/queries');
const queries = new QueryHelper();

//Classe HoraireLogic
module.exports = class HoraireLogic {
    //Fonction permet de faire le linking d'un horaire, soit remplacer les uuid par des urls.
    //Prend en paramètre l'uuid du cinéma auquel l'horaire apartient, ainsi qu'un objet horaire.
    linking(uuidCinema, horaire) {
        horaire.url = utils.baseUrl + "/cinemas/" + horaire.uuidCinema + "/horaires/" + horaire.uuid;
        horaire.cinema = {};
        horaire.cinema.url = utils.baseUrl + "/cinemas/" + horaire.uuidCinema;
        horaire.film = {};
        horaire.film.url = utils.baseUrl + "/cinemas/" + horaire.uuidFilm;
        delete horaire.uuid;
        delete horaire.idHoraire;
        delete horaire.uuidCinema;
        delete horaire.uuidFilm;
    }
    
    //Fonction appliquant la vue par défaut d'un objet horaire.
    //Prend en paramètre l'uuid du cinéma auquel l'horaire apartient, ainsi qu'un objet horaire.
    defaultView(uuidCinema, horaire) {
        //La vue par défaut n'a rien de spécial, fait juste le linking.
        this.linking(uuidCinema, horaire);
    }
    
    //Fonction appliquant la vue link d'un objet horaire.
    //Prend en paramètre l'uuid du cinéma auquel l'horaire apartient, ainsi qu'un objet horaire.
    linkView(uuidCinema, horaire) {
        //La vue link est composé uniquement de de l'url vers la resource.
        //Applique le linking.
        this.linking(uuidCinema, horaire);
        //Retire tout les champs de données sauf horaire.url.
        delete horaire.dateHeure;
        delete horaire.film;
        delete horaire.cinema;
    }
    
    //Fonction appliquant la vue spécifié à un horaire.
    //Prend en paramètre le string du nom de la vue, l'uuid du cinéma auquel l'horaire apartient, ainsi qu'un objet horaire.
    applyView(view, uuidCinema, horaire) {
        switch (view) {
            case 'default':
                this.defaultView(uuidCinema, horaire);
                break;
            case 'link': 
                this.linkView(uuidCinema, horaire);
                break;
            default:
                this.defaultView(uuidCinema, horaire);
                break;
        }
    }


    //Fonction qui récupère les horaires à partir du cinéma associé avec la vue par défaut.
    //Prend en paramètre le uuid du cinéma, int limit et offset pour la pagination et un callback.
    retrieveFromCinema(uuidCinema, limit = null, offset = null, callback) {
        //Récupère les horaires avec la vue par défaut.
        this.retrieveView(uuidCinema, 'default', limit, offset, (result) => {
            callback(result);
        });
    }

    //Fonction qui récupère les horaires associé à un cinéma selon une certaine vue.
    //Prend en paramètre le uuid du cinéma, string view spécifiant la vue, int limit et offset pour la pagination et un callback.
    retrieveView(uuidCinema, view, limit = null, offset = null, callback) {
        let query = queries.selectHoraireCinema(uuidCinema);
        
        //Lance la requête au serveur bd.
        connexion.query(query, (error, rows, fields) => {
            //Objet de réponse.
            let result = {};
            //Liste horaires.
            result.horaires = [];
            if (error) {
                //Enregistre l'erreur s'il y a lieu.
                result.error = error;
            } else if (rows.length === 0) {
                //Enregistre la longueur de la réponse, utile pour présenter une collection vide si nécessaire.
                result.length = 0;
            } else {
                //Applique la vue sur chaque objet horaire et les enregistre dans la liste de la réponse.
                for (let horaire in rows) {
                    this.applyView(view, uuidCinema, rows[horaire]);
                    result.horaires.push(rows[horaire]);
                }
            }
            callback(result);
        });
    }
    
};