const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// Côté boutique
router.put('/shop/:orderId', deliveryController.updateDeliveryByShop);
router.get('/shop/:shopId', deliveryController.getDeliveriesByShop);

router.put('/:id/deliver', deliveryController.markAsDelivered);
// Côté client
router.put('/client/:orderId/confirm', deliveryController.confirmDeliveryByClient);

module.exports = router;
