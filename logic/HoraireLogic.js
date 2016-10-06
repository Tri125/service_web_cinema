const connexion = require('../helpers/database');
const utils = require('../helpers/utils');
const async = require("async");

const QueryHelper = require('../helpers/queries');
const queries = new QueryHelper();


module.exports = class HoraireLogic {
    
    linking(uuidCinema, horaire) {
        horaire.cinema = {};
        horaire.cinema.url = utils.baseUrl + "/cinemas/" + horaire.uuidCinema;
        horaire.film = {};
        horaire.film.url = utils.baseUrl + "/cinemas/" + horaire.uuidFilm;
        delete horaire.idHoraire;
        delete horaire.uuidCinema;
        delete horaire.uuidFilm;
    }
    
    defaultView(uuidCinema, horaire) {
        this.linking(uuidCinema, horaire);
    }
    
    linkView(uuidCinema, horaire) {
        this.linking(uuidCinema, horaire);
        delete horaire.dateHeure;
    }
    
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
/*
    retrieve(cinemaUuid, view, callback) {
        let query = queries.utrry(cinemaUuid);
        
        connexion.query(query, (error, rows, fields) => {
            let result = {};
            if (error) {
                result.error = error;
            } else if (rows.length === 0) {
                result.length = 0;
            } else {
                result.commentaire = rows[0];
                this.applyView(view, filmUuid, result.commentaire);
            }
            callback(result);
        });        
    }
 */  

    retrieveFromCinema(uuidCinema, limit = null, offset = null, callback) {
        this.retrieveView(uuidCinema, 'default', limit, offset, (result) => {
            callback(result);
        });
    }

    retrieveView(uuidCinema, view, limit = null, offset = null, callback) {
        let query = queries.selectHoraireCinema(uuidCinema);
        
        connexion.query(query, (error, rows, fields) => {
            let result = {};
            result.horaires = [];
            if (error) {
                result.error = error;
            } else if (rows.length === 0) {
                result.length = 0;
            } else {
                for (let horaire in rows) {
                    this.applyView(view, uuidCinema, rows[horaire]);
                    result.horaires.push(rows[horaire]);
                }
            }
            callback(result);
        });
    }
};