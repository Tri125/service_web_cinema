class Route {
    constructor(app) {
        this.app = app;       
    }
    
    createResponse(res) {
        res.setHeader('Cache-Control', 'no-cache, no-store');   
        res.set({'Content-Type':'application/json; charset=utf-8'});  
    }
    
    createError(status, message, developperMessage) {
        let error = {};
        error.status = status;
        error.message = message;
        error.developperMessage = developperMessage;
        
        return error;
    }
    
    prepareFields(fields) {
            fields = fields.split(",");
        for (let index in fields) {
            fields[index] = fields[index].trim();
        }
        return fields;
    }
}

module.exports = Route;