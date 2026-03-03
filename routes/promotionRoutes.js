// routes/promotionRoutes.js
const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');

// Créer une promotion
router.post('/', promotionController.createPromotion);
router.get('/shop/:shopId', promotionController.getPromotionsByShop);
router.get('/', promotionController.getPromotions);
module.exports = router;
