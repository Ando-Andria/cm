const express = require('express');
const router = express.Router();
const factureController = require('../controllers/factureController');

router.post('/generate', factureController.createFacturesMensuelles);

module.exports = router;