const mysql = require('mysql');

console.log('🔧 Configuração do banco:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ? '***' : undefined,
    database: process.env.DB_NAME
});

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
