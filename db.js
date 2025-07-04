const mysql = require('mysql');

// Exibe todas as variáveis (só para debug)
console.log('🔎 Variáveis de ambiente carregadas:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME
});

// Configura conexão
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'visitantes'
});

// Tenta conectar
connection.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar no MySQL:', err.message);
    return;
  }
  console.log('🟢 Conectado ao banco de dados MySQL!');
});

module.exports = connection;
