const mysql = require('mysql');

console.log('🔍 process.env.DB_HOST:', process.env.DB_HOST);
console.log('🔍 process.env.DB_USER:', process.env.DB_USER);
console.log('🔍 process.env.DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('🔍 process.env.DB_NAME:', process.env.DB_NAME);

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Erro ao conectar no MySQL:', err.message);
        return;
    }
    console.log('🟢 Conectado ao banco de dados MySQL!');
});

module.exports = connection;
