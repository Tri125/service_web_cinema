//Fichier contenant la logique complexe de la resource Cinema.

const connexion = require('../helpers/database');
const utils = require('../helpers/utils');
const async = require("async");

const HoraireLogic = require("../logic/HoraireLogic");
const horaireLogic = new HoraireLogic();

const QueryHelper = require('../helpers/queries');
const queries = new QueryHelper();

//Classe CinemaLogic
module.exports = class CinemaLogic {
    
    //Fonction remplacant les uuid/id par des urls.
    //Prend en paramètre un objet cinema.
    linking(cinema) {
        cinema.url = utils.baseUrl + "/cinemas/" + cinema.uuid;
        //Supression des id/uuid.
        delete cinema.idCinema;
        delete cinema.uuid;
    }
    
    //Fonction aidant dans le rajout d'une liste d'horaires dans un objet cinema.
    //Prend en paramètre un objet cinema et une liste d'objet horaire.
    //TODO: L'enlever.
    addHoraires(cinema, horaires) {
        cinema.horaires = horaires;
    }
    
    //Fonction qui récupère un cinéma par son uuid. Réponse en callback.
    //Prend en paramètre l'uuid du cinéma et un callback.
    retrieve(uuid, callback) {
        let query = queries.selectCinema(uuid);
        //Exécute la requête bd.
        connexion.query(query, (error, rows, fields) => {
            //Objet de réponse.
            let result = {};
            
            if (error) {
                //S'il y a une erreur bd, enregistre là.
                result.error = error;
            } else if (rows.length === 0) {
                result.length = 0;
            } else {
                //Enregistre le cinema et applique le linking.
                result.cinema = rows[0];
                this.linking(result.cinema);
            }
            
            callback(result);
        });
    }
    
    //Fonction permettant la gestion du param url fields pour retirer de l'objet cinema les champs
    //qui ne nous interesse pas pour la requête.
    //Prend en paramètre un objet cinema, une liste de string contenant les champs désirés de l'objet et callback. 
    handleFields(cinema, fields, callback) {
        //Explication de la magie:
        //Javascript passe tout par valeur, mais on peux opérer directement sur les champs d'un objet.
        //ie: enlever un champ, changer la valeur d'un champ.
        //Par contre, on ne peux pas réassigner un objet passé en paramètre dans une fonction.
        //ie: Si on envoie cinema dans une fonction on ne peux pas le réassigner à un nouveau objet cinema bien construit.
        //Conclusion: Il faut faire travailler sur une copie et transférer le résultat un à un sur le même objet.
        
        //La plus simple façon de faire un clone dans javascript à ma connaissance.
        //Transforme l'objet cinema en string et le re sérialize dans un nouveau objet json.
        let cinemaCopy = (JSON.parse(JSON.stringify(cinema)));
        //Enlève tout les champs de cinema.
        this.deleteAll(cinema);
        
        //Appel async pour une itération sur chaque string field dans fields.
        async.each(fields, function HandleFilm(field, next) {
            //Switch case à savoir quel champ nous interesse pour l'objet cinema.
            switch (field) {
                case 'nom':
                    cinema.nom = cinemaCopy.nom;
                    break;
                case 'adresse':
                    cinema.adresse = cinemaCopy.adresse;
                    break;
                case 'ville':
                    cinema.ville = cinemaCopy.ville;
                    break;
                case 'codePostal':
                    cinema.codePostal = cinemaCopy.codePostal;
                    break;
                case 'telephone':
                    cinema.telephone = cinemaCopy.telephone;
                    break;
                case 'horaires':
                    cinema.horaires = cinemaCopy.horaires;
                    break;
                case 'url':
                    cinema.url = cinemaCopy.url;
                    break;
                default:
                    break;
            }
            //Appel le callback next() pour signaler que l'élément est complété.
            next();
        }, function End() {
            //Fin de l'appel async.
            callback(cinema);
        });
    }
    
    //Fonction qui supprime tout les champs de l'objet cinema.
    //Prend en paramètre un objet cinema.
    deleteAll(cinema) {
        for (var key in cinema) {
            delete cinema[key];
        }
    }
    
    //Fonction pour faire une mise à jour complète d'un objet cinema dans la base de données.
    //Prend en paramètre un objet cinema et callback.
    handlePut(cinema, callback) {
        let query = queries.updateCinema(cinema);
        let uuid = cinema.uuid;
        
        connexion.query(query, (error, updateResult) => {
            //Objet de réponse.
            let result = {};
            
            if (error) {
                //S'il y a une erreur dans la mise à jour.
                result.error = error;
                callback(result);
            } else {
                //Puisque lors d'une mise à jour nous voulons réenvoyer une représentation de l'objet au client, il est plus simple de faire une nouvelle
                //requête pour récupérer le même cinéma mit à jour. (Ne marcherais pas dans une bd ou il y a un temps de propagation).
                this.retrieve(uuid, (resultCinema) => {
                    if (resultCinema.error) {
                        result.error = resultCinema.error;
                        callback(result);
                    } else if (resultCinema.length === 0) {
                        //Ne devrait pas se produire.
                        result.error = "Le cinema n'existe pas.";
                        callback(result);
                    } else {
                        //Enregistre le cinéma dans la variable.
                        let cinemaResponse = resultCinema.cinema;
                        //Récupère les horaires associé au cinéma et applique la vue link.
                        horaireLogic.retrieveView(uuid, 'link', null, null, (resultHoraire) => {
                            if (resultHoraire.error) {
                                //Gestion
                            } else {
                                //Rajoute la liste d'horaires au cinéma.
                                this.addHoraires(cinemaResponse, resultHoraire.horaires);
                            }
                            //Enregistre le cinéma dans l'objet de réponse.
                            result.cinema = cinemaResponse;
                            callback(result);
                            
                        });
                    }
                });
            }
        });
    }
};