//Contient les règles de validations d'un objet Film. 

module.exports = class FilmValidator {
  
  static Required() {
    return {
      'titre': {
        notEmpty: true,
        isLength: {
          options: [{ min: 1, max: 255}],
          errorMessage: "Doit être compris entre 1 et 255 caractères."
        },
        errorMessage: "Titre est requis."
        
      },
      'pays': {
        notEmpty: true,
        isLength: {
          options: [{ min: 1, max: 100}],
          errorMessage: "Doit être compris entre 1 et 100 caractères."
        },
        errorMessage: "Pays est requis."
        
      },
      'genre': {
        notEmpty: true,
        isLength: {
          options: [{ min: 1, max: 20}],
          errorMessage: "Doit être compris entre 1 et 20 caractères."
        },
        errorMessage: "Genre est requis."
        
      },
      'classe': {
        notEmpty: true,
        isLength: {
          options: [{ min: 1, max: 3}],
          errorMessage: "Doit être compris entre 1 et 3 caractères."
        },
        errorMessage: "Classe est requis."
        
      },
      'duree': {
        notEmpty: true,
        isInt: {
          options: [{ min: 0}],
          errorMessage: "Durée doit être un entier au minimum 0."
        },
        errorMessage: "Durée est requis."
      },
      'realisateur': {
        notEmpty: true,
        isLength: {
          options: [{ min: 1, max: 100}],
          errorMessage: "Doit être compris entre 1 et 100 caractères."
        },
        errorMessage: "Réalisateur est requis."
      },
      'imageUrl': {
        notEmpty: true,
        isURL: {
          options: [ { require_protocol: true }],
          errorMessage: "Doit être une url avec le protocol spécifié."
        },
        errorMessage: "ImageUrl est requis."
      }
      
    };
  }
  
  //J'étais incapable de juste modifier Required au runtime pour rentre les champs optionnels.
  static Optional() {
    return {
      'titre': {
        optional: true,
        notEmpty: true,
        isLength: {
          options: [{ min: 1, max: 255}],
          errorMessage: "Doit être compris entre 1 et 255 caractères."
        },
        errorMessage: "Titre est requis."
        
      },
      'pays': {
        optional: true,
        notEmpty: true,
        isLength: {
          options: [{ min: 1, max: 100}],
          errorMessage: "Doit être compris entre 1 et 100 caractères."
        },
        errorMessage: "Pays est requis."
        
      },
      'genre': {
        optional: true,
        notEmpty: true,
        isLength: {
          options: [{ min: 1, max: 20}],
          errorMessage: "Doit être compris entre 1 et 20 caractères."
        },
        errorMessage: "Genre est requis."
        
      },
      'classe': {
        optional: true,
        notEmpty: true,
        isLength: {
          options: [{ min: 1, max: 3}],
          errorMessage: "Doit être compris entre 1 et 3 caractères."
        },
        errorMessage: "Classe est requis."
        
      },
      'duree': {
        optional: true,
        notEmpty: true,
        isInt: {
          options: [{ min: 0}],
          errorMessage: "Durée doit être un entier au minimum 0."
        },
        errorMessage: "Durée est requis."
      },
      'realisateur': {
        optional: true,
        notEmpty: true,
        isLength: {
          options: [{ min: 1, max: 100}],
          errorMessage: "Doit être compris entre 1 et 100 caractères."
        },
        errorMessage: "Réalisateur est requis."
      },
      'imageUrl': {
        optional: true,
        notEmpty: true,
        isURL: {
          options: [ { require_protocol: true }],
          errorMessage: "Doit être une url avec le protocol spécifié."
        },
        errorMessage: "ImageUrl est requis."
      }
      
    };
  }
  
};