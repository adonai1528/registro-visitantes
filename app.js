
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

require('dotenv').config();


const db = require('./db');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'segredo-super-seguro',
  resave: false,
  saveUninitialized: false
}));

// Middleware para verificar login
function verificarLogin(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/login');
}

// --- ROTAS ---

// Página inicial - redireciona para login
app.get('/dados-grafico', (req, res) => {
  db.query(`
    SELECT apartamento, COUNT(*) AS total 
    FROM visitantes 
    GROUP BY apartamento 
    ORDER BY total DESC
  `, (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados do gráfico:', err);
      return res.status(500).json({ erro: 'Erro ao buscar dados do gráfico' });
    }

    const dadosGrafico = {
      labels: results.map(row => `Ap ${row.apartamento}`),
      dados: results.map(row => row.total)
    };

    res.json(dadosGrafico);
  });
});


// Tela de login (renderiza login.ejs)
app.get('/login', (req, res) => {
  res.render('login');
});

// Processa login
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  const query = 'SELECT * FROM porteiros WHERE usuario = ?';

  db.query(query, [usuario], (err, results) => {
    if (err) {
      console.error('Erro no banco:', err);
      return res.send('Erro no sistema');
    }

    if (results.length === 0) {
      return res.send('Usuário não encontrado!');
    }

    const porteiro = results[0];
    bcrypt.compare(senha, porteiro.senha, (err, match) => {
      if (err) {
        console.error('Erro no bcrypt:', err);
        return res.send('Erro no sistema');
      }
      if (match) {
        req.session.user = { id: porteiro.id, usuario: porteiro.usuario };
        return res.redirect('/painel');
      } else {
        return res.send('Senha incorreta!');
      }
    });
  });
});

// Painel (somente logados)
app.get('/painel', verificarLogin, (req, res) => {
  res.render('painel', { usuario: req.session.user.usuario });
});

// Página de cadastro de visitante (somente logados)
app.get('/cadastro', verificarLogin, (req, res) => {
  res.render('cadastro'); // Crie cadastro.ejs com seu formulário
});

// Recebe dados do cadastro e salva no banco
app.post('/cadastro', verificarLogin, (req, res) => {
  const { nome, cpf, data_hora, apartamento, motivo, tipo } = req.body;

  const query = `INSERT INTO visitantes (nome, cpf, data_hora, apartamento, motivo, tipo) VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(query, [nome, cpf, data_hora, apartamento, motivo, tipo], (err) => {
    if (err) {
      console.error('Erro ao salvar visitante:', err);
      return res.send('Erro ao salvar visitante.');
    }
    res.send('Visitante registrado com sucesso! <a href="/cadastro">Voltar</a>');
  });
});

// Listar visitantes (com filtro opcional por data) (somente logados)
app.get('/visitantes', verificarLogin, (req, res) => {
  const data = req.query.data;
  let sql = 'SELECT * FROM visitantes';
  let params = [];

  if (data) {
    sql += ' WHERE DATE(data_hora) = ?';
    params.push(data);
  }

  sql += ' ORDER BY data_hora DESC';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Erro ao consultar visitantes:', err);
      return res.send('Erro ao consultar visitantes.');
    }
    res.render('visitantes', { visitantes: results });
  });
});

// Registrar saída do visitante (somente logados)
app.post('/registrar-saida/:id', verificarLogin, (req, res) => {
  const id = req.params.id;
  const dataSaida = new Date();

  const sql = 'UPDATE visitantes SET saida = ? WHERE id = ?';

  db.query(sql, [dataSaida, id], (err) => {
    if (err) {
      console.error('Erro ao registrar saída:', err);
      return res.status(500).send('Erro ao registrar saída.');
    }
    res.redirect('/visitantes');
  });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
      return res.status(500).send('Erro ao encerrar sessão.');
    }
    res.redirect('/login');
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
