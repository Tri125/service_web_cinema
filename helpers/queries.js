//Fichier contenant toutes les requêtes SQL.

const utils = require('../helpers/utils');
const connexion = require('../helpers/database');


class Queries {

    //Fonction qui retourne la requête sélectionnant tout les films.
    //Prend en paramètre limit et offset, des int permettant la pagination.
    selectFilms(limit = null, offset = null) {
        //Construction de la requête.
        let query = "SELECT * FROM Films";
        //Retourne la requête modifié selon offset et limit.
        query = this.handlePagination(query, offset, limit);
        return query;
    }
    
    //Fonction qui retourne la requête sélectionnant un film selon son uuid.
    //Prend en paramètre l'uuid du film désiré.
    selectFilm(uuid) {
        //Construction de la requête.
        let query = "SELECT * FROM Films WHERE uuid = '{0}'";
        query = query.format(uuid);
        return query;
    }
    
    //Fonction qui retourne la requête sélectionnant les horaires d'un cinéma passant par paramètre le uuid du cinéma.
    //Prend en paramètre l'uuid du cinéma désiré.
    selectHoraireCinema(uuidCinema) {
        let query = "SELECT h.uuid, h.idHoraire, f.uuid AS uuidFilm, c.uuid AS uuidCinema, dateHeure, titre FROM Horaires AS h INNER JOIN Cinemas AS c ON c.idCinema = h.idCinema INNER JOIN Films AS f ON f.idFilm = h.idFilm  WHERE c.uuid = {0}";
        //Échapement de uuidCinema pour prévenir les injections sql.
        query = query.format(connexion.escape(uuidCinema));
        return query;
    }
    
    //Fonction qui retourne la requête sélectionnant tous les cinémas.
    //Prend en paramètre deux int limit et offset pour permettre la pagination.
    selectCinemas(limit = null, offset = null) {
        let query = "SELECT * FROM Cinemas";
        //Retourne la requête modifié selon offset et limit.
        query = this.handlePagination(query, offset, limit);
        return query;
    }
    
    //Fonction qui retourne la requête sélectionnant un cinéma selon son uuid passé en paramètre.
    //Prend en paramètre le uuid du cinéma désiré.
    selectCinema(uuid) {
        let query = "SELECT * FROM Cinemas WHERE uuid = {0}";
        //Échappement de la string pour prévenir les injections sql.
        query = query.format(connexion.escape(uuid));
        return query;
    }
    
    
    //Fonction pour insérer un nouveau film dans la base de données.
    //L'objet film complet est passé en paramètre.
    insertFilm(film) {
        let query = "INSERT INTO Films (uuid, titre, pays, duree, genre, classe, realisateur, imageUrl) VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}) ";
        //Échappement pour éviter les injections sql.
        query = query.format(connexion.escape(film.uuid), connexion.escape(film.titre), connexion.escape(film.pays), connexion.escape(film.duree), 
        connexion.escape(film.genre), connexion.escape(film.classe), connexion.escape(film.realisateur), connexion.escape(film.imageUrl));
        
        return query;
    }
    
    //Fonction pour insérer un nouveau cinéma dans la base de données.
    //L'objet cinéma complet est passé en paramètre.
    insertCinema(cinema) {
        let query = "INSERT INTO Cinemas (uuid, nom, adresse, ville, codePostal, telephone) VALUES ({0}, {1}, {2}, {3}, {4}, {5})";
        query = query.format(connexion.escape(cinema.uuid), connexion.escape(cinema.nom), connexion.escape(cinema.adresse),
        //Échappement pour éviter les injections sql.
        connexion.escape(cinema.ville), connexion.escape(cinema.codePostal), connexion.escape(cinema.telephone) );
        return query;
    }
    
    
    //Fonction pour insérer un nouveau commentaire dans la base de données.
    //L'objet cinéma complet est passé en paramètre.
    insertCommentaire(commentaire) {
        let query = "INSERT INTO Commentaires (idFilm, uuid, texte, note, auteur) VALUES ( (SELECT idFilm FROM Films AS f WHERE f.uuid = {0}), {1}, {2}, {3}, {4})";
        //Échappement pour éviter les injections sql.
        query = query.format(connexion.escape(commentaire.filmUuid), connexion.escape(commentaire.uuid), connexion.escape(commentaire.texte),
        connexion.escape(commentaire.note), connexion.escape(commentaire.auteur));
    
        return query;
    }
    
    //Fonction pour retourner la requête pour faire une mise à jour complet d'un objet cinéma en base de données.
    //L'objet cinéma complet est passé en paramètre
    updateCinema(cinema) {
        let query = "UPDATE Cinemas SET nom = {0}, adresse = {1}, ville = {2}, codePostal = {3}, telephone = {4} WHERE uuid = {5}";
        //Échappement pour éviter les injections sql.
        query = query.format(connexion.escape(cinema.nom), connexion.escape(cinema.adresse), connexion.escape(cinema.ville), 
        connexion.escape(cinema.codePostal), connexion.escape(cinema.telephone), connexion.escape(cinema.uuid));
        
        return query;
    }
    
    
    //Fonction pour retourner la requête permettant un patch d'un film dans la base de données.
    //Donne en paramètre l'uuid du film visé par la mise à jour, ainsi qu'un objet film avec les champs a modifier.
    patchFilm(uuid, film) {
        let query = "UPDATE Films SET ";
        //Construit la requête selon le champ disponible dans l'objet.
        if (film.titre)
            query += "titre = '" + film.titre + "',";
        if (film.pays)
            query += "pays = '" + film.pays + "',";
        if (film.genre)
            query += "genre = '" + film.genre + "',";
        if (film.classe)
            query += "classe = '" + film.classe + "',";
        if (film.duree)
            query += "duree =" + film.duree + ",";              
        if (film.realisateur)
            query += "realisateur = '" + film.realisateur + "',";
        if (film.imageUrl)
            query += "imageUrl = '" + film.imageUrl + "' ";
        
        //Aucune asumption si quel champs est modifié, doit retirer la virgule à la fin du string pour une syntaxe SQL valide.    
        if (query.slice(-1) === ',') {
            query = query.substr(0, query.length -1);
        }    
            
        query += " WHERE uuid = '" + uuid + "'";
        
        return query;
    }
    
    //Foncion pour retourner la requête permettant la supression d'un film dans la base de données.
    //Passe l'uuid du film visé en paramètre.
    deleteFilm (uuid) {
        let query = "DELETE FROM Films WHERE uuid = {0}";
        //Échappement pour éviter les injections sql.
        query = query.format(connexion.escape(uuid));
        
        return query;
    }
    
    
    //Fonction pour retourner la requête permettant la supression d'un commentaire dans la base de données.
    //Passe l'uuid du commentaire visé en paramètre.
    deleteCommentaire(uuid) {
        let query = "DELETE FROM Commentaires WHERE uuid = {0}";
        //Échappement pour éviter les injections sql.
        query = query.format(connexion.escape(uuid));
        
        return query;
    }
    
    //Fonction pour retourner les commentaires d'un film.
    //Passe en paramètre l'uuid du film visé, ainsi que limit et offset pour la pagination.
    selectFilmCommentaires(uuid, limit = null, offset = null) {
        
        let query = "SELECT c.uuid, c.texte, c.note, c.auteur, c.dateHeure FROM Commentaires AS c INNER JOIN Films AS f ON c.idFilm = f.idFilm WHERE f.uuid = '{0}'";
        query = query.format(uuid);
        //Retourne la requête modifié selon limit et offset.
        query = this.handlePagination(query, offset, limit);
        return query;
    }
    
    //Fonction pour retourner la requête permettant la sélection d'un commentaire.
    //Prend en paramètre l'uuid du commentaire désiré.
    selectCommentaire(uuid) {
        let query = "SELECT * FROM Commentaires WHERE uuid = {0}";
        //Échappement pour éviter les injections sql.
        query = query.format(connexion.escape(uuid));
        
        return query;
    }
    
    //Fonction permettant d'ajouter dans une requête la limit et l'offset désiré.
    //Prend en paramêtre la string query, ainsi que les deux int offset et limit.
    handlePagination(query, offset, limit) {
        if (offset && limit) {
            query += " LIMIT " + limit + " OFFSET " + offset;
        }
        return query;
    }
}

module.exports = Queries;