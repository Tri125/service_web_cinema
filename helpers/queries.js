const utils = require('../helpers/utils');
const connexion = require('../helpers/database');

class Queries {

    selectFilms(fields = "*", limit = null, offset = null) {
        if (!fields)
        {
            fields = "*";
        }
        let query = "SELECT " + fields + " FROM Films";
        
        query = this.handlePagination(query, offset, limit);
        return query;
    }
    
    selectFilm(uuid, fields = "*") {
        if (!fields)
        {
            fields = "*";
        }
        let query = "SELECT " + fields + " FROM Films WHERE uuid = '{0}'";
        query = query.format(uuid);
        return query;
    }
    
    insertFilm(film) {
        let query = "INSERT INTO Films (uuid, titre, pays, duree, genre, classe, realisateur, imageUrl) VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}) ";
        query = query.format(connexion.escape(film.uuid), connexion.escape(film.titre), connexion.escape(film.pays), connexion.escape(film.duree), 
        connexion.escape(film.genre), connexion.escape(film.classe), connexion.escape(film.realisateur), connexion.escape(film.imageUrl));
        
        return query;
    }
    
    insertCommentaire(commentaire) {
        let query = "INSERT INTO Commentaires (idFilm, uuid, texte, note, auteur) VALUES ( (SELECT idFilm FROM Films AS f WHERE f.uuid = {0}), {1}, {2}, {3}, {4})";
        query = query.format(connexion.escape(commentaire.filmUuid), connexion.escape(commentaire.uuid), connexion.escape(commentaire.texte),
        connexion.escape(commentaire.note), connexion.escape(commentaire.auteur));
    
        return query;
    }
    
    patchFilm(uuid, film) {
        let query = "UPDATE Films SET ";
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
            
        if (query.slice(-1) === ',') {
            query = query.substr(0, query.length -1);
        }    
            
        query += " WHERE uuid = '" + uuid + "'";
        
        return query;
    }
    
    deleteFilm (uuid) {
        let query = "DELETE FROM Films WHERE uuid = {0}";
        query = query.format(connexion.escape(uuid));
        
        return query;
    }
    
    deleteCommentaire(uuid) {
        let query = "DELETE FROM Commentaires WHERE uuid = {0}";
        query = query.format(connexion.escape(uuid));
        
        return query;
    }
    
    selectFilmCommentaires(uuid, limit = null, offset = null) {
        
        let query = "SELECT c.uuid, c.texte, c.note, c.auteur, c.dateHeure FROM Commentaires AS c INNER JOIN Films AS f ON c.idFilm = f.idFilm WHERE f.uuid = '{0}'";
        query = query.format(uuid);
        
        query = this.handlePagination(query, offset, limit);
        return query;
    }
    
    selectCommentaire(uuid) {
        let query = "SELECT * FROM Commentaires WHERE uuid = {0}";
        query = query.format(connexion.escape(uuid));
        
        return query;
    }
    
    handlePagination(query, offset, limit) {
        if (offset && limit) {
            query += " LIMIT " + limit + " OFFSET " + offset;
        }
        return query;
    }
}

module.exports = Queries;