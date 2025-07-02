const mysql = require('mysql');

function conectarComRetry(tentativas = 5) {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  console.log('🔧 Configuração do banco:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME
});


  function conectar() {
    connection.connect((err) => {
      if (err) {
        console.error(`Erro ao conectar no MySQL: ${err.message}`);
        if (tentativas > 0) {
          console.log(`⏳ Tentando novamente em 5 segundos... (${tentativas} tentativas restantes)`);
          setTimeout(() => conectarComRetry(tentativas - 1), 5000);
        } else {
          console.error('❌ Não foi possível conectar ao MySQL após várias tentativas.');
        }
        return;
      }

      console.log('🟢 Conectado ao banco de dados MySQL!');
    });
  }

  conectar();
  return connection;
}

const connection = conectarComRetry();
module.exports = connection;
