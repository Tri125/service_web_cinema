//Module permettant d'avoir l'url de base des urls des resources, ainsi que la version de l'api.
module.exports = {
    version:"1.0",
    baseUrl:"https://tp1-web-services-tri125.c9users.io"
};

//Fonction format rajouté aux types string pour faire du formattage de string.
//  let s = "Bonne {0}";
//  let input = "journée";
//  s.format(input);
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}