const pgp = require("pg-promise")();
const options = {
    "host": "localhost",
    "port": 5432,
    "database": "elensiya",
    "user": "elensiya",
    "password": "1iloveanime1"
}
const db = pgp(options);
module.exports = db;