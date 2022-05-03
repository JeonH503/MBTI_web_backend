const mysql = require("mysql");
const fs = require("fs");
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);

const connection = mysql.createConnection({
  host: conf.host, //54.180.122.20
  user: conf.user,
  password: conf.password,
  database: conf.database,
});

module.exports = connection;
