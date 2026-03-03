const express = require('express');
const router = express.Router();
const orderController = require('../controllers/validateOdrerController');

// Valider une commande
router.put('/:orderId', orderController.validateOrder);

module.exports = router;
