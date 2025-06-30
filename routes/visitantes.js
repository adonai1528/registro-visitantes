// routes/visitantes.js
const express = require('express');
const router = express.Router();

// Rota de teste
router.get('/teste', (req, res) => {
    res.send('Rota de visitantes funcionando!');
});

module.exports = router;
