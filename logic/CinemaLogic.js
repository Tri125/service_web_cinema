const connexion = require('../helpers/database');
const utils = require('../helpers/utils');
const async = require("async");

const HoraireLogic = require("../logic/HoraireLogic");
const horaireLogic = new HoraireLogic();

const QueryHelper = require('../helpers/queries');
const queries = new QueryHelper();

module.exports = class CinemaLogic {
    
    linking(cinema) {
        cinema.url = utils.baseUrl + "/cinemas/" + cinema.uuid;

        delete cinema.idCinema;
        delete cinema.uuid;
    }
    
    addHoraires(cinema, horaires) {
        cinema.horaires = horaires;
    }
    
    retrieve(fields, uuid, callback) {
        let query = queries.selectCinema(uuid, fields);
        
        connexion.query(query, (error, rows, fields) => {
            let result = {};
            
            if (error) {
                result.error = error;
            } else if (rows.length === 0) {
                result.length = 0;
            } else {
                result.cinema = rows[0];
                this.linking(result.cinema);
            }
            
            callback(result);
        });
    }
    
    handleFields(cinema, fields, callback) {
        let cinemaResponse = {};
        let cinemaCopy = (JSON.parse(JSON.stringify(cinema)));
        this.deleteAll(cinema);
        
        async.each(fields, function HandleFilm(field, next) {
            switch (field) {
                case 'nom':
                    cinemaResponse.nom = cinemaCopy.nom;
                    break;
                case 'adresse':
                    cinemaResponse.adresse = cinemaCopy.adresse;
                    break;
                case 'ville':
                    cinemaResponse.ville = cinemaCopy.ville;
                    break;
                case 'codePostal':
                    cinemaResponse.codePostal = cinemaCopy.codePostal;
                    break;
                case 'telephone':
                    cinemaResponse.telephone = cinemaCopy.telephone;
                    break;
                case 'horaires':
                    cinemaResponse.horaires = cinemaCopy.horaires;
                    break;
                case 'url':
                    cinemaResponse.url = cinemaCopy.url;
                    break;
                default:
                    break;
            }
            next();
        }, function End() {
            for (let key in cinemaResponse) {
                cinema[key] = cinemaResponse[key];
            }
            callback(cinema);
        });
    }
    
    deleteAll(cinema) {
        delete cinema.nom;
        delete cinema.url;
        delete cinema.adresse;
        delete cinema.ville;
        delete cinema.codePostal;
        delete cinema.telephone;
        delete cinema.horaires;
    }
    
    retrieveHoraires(cinema, callback) {
       horaireLogic.retrieveView(cinema.uuid, 'link', null, null (resultHoraires) => {
           if (resultHoraires.error) {
               //Gestion
            } else {
                this.addHoraires(cinema, resultHoraires.horaires);
            }
           callback(cinema);
       });
    }
    
    handlePut(uuid, cinema, callback) {
        let query = queries.updateCinema(uuid, cinema);
        
        connexion.query(query, (error, updateResult) => {
            let result = {};
            
            if (error) {
                result.error = error;
                callback(result);
            } else {
                this.retrieve('*', uuid, (resultCinema) => {
                    if (resultCinema.error) {
                        result.error = resultCinema.error;
                        callback(result);
                    } else if (resultCinema.length === 0) {
                        result.error = "Le cinema n'existe pas.";
                        callback(result);
                    } else {
                        let cinemaResponse = resultCinema.cinema;
                        horaireLogic.retrieveView(uuid, 'link', null, null, (resultHoraire) => {
                            if (resultHoraire.error) {
                                //Gestion
                            } else {
                                this.addHoraires(cinemaResponse, resultHoraire.horaires);
                            }
                            result.cinema = cinemaResponse;
                            callback(result);
                            
                        });
                    }
                });
            }
        });
    }
};