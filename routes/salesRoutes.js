// routes/saleRoutes.js
const express = require('express');
const router = express.Router();
const saleController = require('../controllers/salesController');

router.post('/', saleController.createSale);            // Créer une vente (panier)
router.get('/', saleController.getSales);              // Lister toutes les ventes
router.get('/shop/:shopId', saleController.getSalesByShop); // Ventes par boutique
router.put('/:id', saleController.updateSale);         // Mettre à jour une vente
router.delete('/:id', saleController.deleteSale);      // Supprimer une vente

module.exports = router;
