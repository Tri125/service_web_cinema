var mysql = require("mysql");
module.exports = mysql.createConnection({
   host:process.env.IP,
   user:'tri125',
   password:'',
   database:'cinema_montreal'
});