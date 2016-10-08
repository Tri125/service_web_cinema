// Classe et fonctionalité de base pour toutes les routes.

//Include du package validator pour faire des validations de bases.
//https://www.npmjs.com/package/validator
var validator = require('validator');

//Classe Route où toute les autres route hérite.
class Route {
    constructor(app) {
        this.app = app;       
    }
    
    //Fonction qui met les champs de base dans les reponses http.
    createResponse(res) {
        res.setHeader('Cache-Control', 'no-cache, no-store');   
        res.set({'Content-Type':'application/json; charset=utf-8'});  
    }
    
    //Fonction qui crée le format d'un message d'erreur.
    createError(status, message, developperMessage) {
        let error = {};
        //Code http
        error.status = status;
        //Message à l'utilisateur
        error.message = message;
        //Message au développeur
        error.developperMessage = developperMessage;
        
        return error;
    }
    
    //Fonction qui prépare le param url fields en séparant le string à chaque virgule.
    prepareFields(fields) {
            fields = fields.split(",");
        for (let index in fields) {
            fields[index] = fields[index].trim();
        }
        return fields;
    }
    
    //Fonction qui valide les bornes de limit et offset.
    validateLimitOffset(limit, offset) {
        //Règle de validation, on ne veux pas une valeur négative.
        let validationRules = { min: 0};
        //Valide que limit et offset sont des int de valeur 0 ou plus.
        //Limit et offset doivent êtres conjointement utilisés. Limit n'est pas permit dans la validation même si c'est une syntaxe valide en MySQL.
        if (validator.isInt(limit, validationRules) && validator.isInt(offset, validationRules)) {
            return true;
        }
        return false;
    }
    
}

module.exports = Route;