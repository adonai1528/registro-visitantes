
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',         
    password: 'gilda240',         
    database: 'visitantes'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('🟢 Conectado ao banco de dados MySQL!');
});

module.exports = connection;
