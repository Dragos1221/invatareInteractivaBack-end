const { createPool} = require('mysql');


const pool=createPool({
    host:"bqv1nttbika0xi8qr6uu-mysql.services.clever-cloud.com",
    user:"uonm0t7okayn3mce",
    password:"t9ooNVBKHElysKoMAJtp",
    database:"bqv1nttbika0xi8qr6uu",
    port:3306,
});


module.exports = {
    connection: pool,
};