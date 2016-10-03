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
        let query = "INSERT INTO Films (uuid, titre, pays, duree, genre, classe, realisateur) VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}) ";
        query = query.format(connexion.escape(film.uuid), connexion.escape(film.titre), connexion.escape(film.pays), connexion.escape(film.duree), 
        connexion.escape(film.genre), connexion.escape(film.classe), connexion.escape(film.realisateur));
        
        return query;
    }
    
    selectFilmCommentaires(uuid, offset = null, limit = null) {
        
        let query = "SELECT c.uuid, c.texte, c.note, c.auteur, c.dateHeure FROM Commentaires AS c INNER JOIN Films AS f ON c.idFilm = f.idFilm WHERE f.uuid = '{0}'"
        query = query.format(uuid);
        
        query = this.handlePagination(query, offset, limit);
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