const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/shop/:shopId', orderController.getOrdersByShop);
router.get('/customer/:customerId', orderController.getOrdersByCustomer);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);
router.put('/:id/pay', orderController.markAsPaid);
router.put('/:id/deliver', orderController.markAsDelivered);
router.put('/:id/delivered', orderController.markAsDeliveredByCustomer);
module.exports = router;
