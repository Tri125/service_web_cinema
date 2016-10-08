//Contient les règles de validation d'un objet Commentaire.

module.exports = class CommentaireValidator {
  
  static Required() {
    return {
      'texte': {
        notEmpty: true,
        isLength: {
          options: [{ min: 1, max: 255}],
          errorMessage: "Doit être compris entre 1 et 255 caractères."
        },
        errorMessage: "Texte est requis."
        
      },
      'note': {
        notEmpty: true,
        isInt: {
          options: [{ min: 0, max: 10}],
          errorMessage: "Doit être compris entre 0 et 10."
        },
        errorMessage: "Note est requis."
        
      },
      'auteur': {
        notEmpty: true,
        isLength: {
          options: [{ min: 1, max: 100}],
          errorMessage: "Doit être compris entre 1 et 100 caractères."
        },
        errorMessage: "Auteur est requis."
        
      }
    };
  }
  
  //J'étais incapable de juste modifier Required au runtime pour rentre les champs optionnels.
  static Optional() {
    return {
      'texte': {
          optional: true,
          notEmpty: true,
          isLength: {
            options: [{ min: 1, max: 255}],
            errorMessage: "Doit être compris entre 1 et 255 caractères."
        },
        errorMessage: "Texte est requis."
        
      },
      'note': {
          optional: true,
          notEmpty: true,
          isInt: {
              options: [{ min: 0, max: 10}],
              errorMessage: "Doit être compris entre 0 et 10."
          },
          errorMessage: "Note est requis."
        
      },
      'auteur': {
          optional: true,
          notEmpty: true,
          isLength: {
              options: [{ min: 1, max: 100}],
              errorMessage: "Doit être compris entre 1 et 100 caractères."
          },
          errorMessage: "Auteur est requis."
      }
    };
  }
  
};