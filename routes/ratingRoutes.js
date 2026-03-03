const express = require('express');
const router = express.Router();
const { rateProduct, getProductRating } = require('../controllers/ProductRatingController');

// Ajouter ou mettre à jour une note
router.post('/', rateProduct);

// Récupérer la note moyenne d’un produit
router.get('/:productId', getProductRating);

module.exports = router;