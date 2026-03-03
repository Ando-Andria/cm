const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

// Routes pour les boutiques
router.post('/', shopController.createShop);
router.get('/', shopController.getShops);
router.put('/:id', shopController.updateShop);
router.delete('/:id', shopController.deleteShop);
router.get('/active', shopController.getActiveShops);
router.get('/by-category/:categoryId', shopController.getShopsByCategory);
router.get('/:id', shopController.getShopById);


module.exports = router;

