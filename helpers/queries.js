const utils = require('../helpers/utils');

class Queries {

    selectFilms(fields = "*", offset = null, limit = null) {
        if (!fields)
        {
            fields = "*"
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