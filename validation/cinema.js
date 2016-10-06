module.exports = class CinemaValidator {
  
  static Required() {
    return {
      'nom': {
        notEmpty: true,
        isLength: {
          options: [{ min: 1, max: 100}],
          errorMessage: "Doit être compris entre 1 et 100 caractères."
        },
        errorMessage: "Nom est requis."
        
      },
      'adresse': {
        notEmpty: true,
        isLength: {
          options: [{ min: 1, max: 255}],
          errorMessage: "Doit être compris entre 1 et 255 caractères."
        },
        errorMessage: "Adresse est requis."
        
      },
      'ville': {
        notEmpty: true,
        isLength: {
          options: [{ min: 1, max: 100}],
          errorMessage: "Doit être compris entre 1 et 100 caractères."
        },
        errorMessage: "Ville est requis."
        
      },
      'codePostal': {
        notEmpty: true,
        isLength: {
          options: [{ min: 6, max: 6}],
          errorMessage: "Doit être 6 caractères."
        },
        errorMessage: "Code postal est requis."
        
      },
      'telephone': {
        notEmpty: true,
        isLength: {
          options: [{ min: 10, max: 11}],
          errorMessage: "Le numéro de téléphone doit être du format suivant: 5142811900 ou 15142811900"
        },
        errorMessage: "Le numéro de téléphone est requis."
      }
    };
  }
  
};