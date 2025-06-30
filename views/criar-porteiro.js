// criar-porteiro.js
const bcrypt = require('bcrypt');
const db = require('./db');

const usuario = 'admin';
const senha = '123456';

bcrypt.hash(senha, 10, (err, hash) => {
    if (err) throw err;

    const query = 'INSERT INTO porteiros (usuario, senha) VALUES (?, ?)';
    db.query(query, [usuario, hash], (err, results) => {
        if (err) throw err;
        console.log('✅ Porteiro criado com sucesso!');
        process.exit();
    });
});
