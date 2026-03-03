const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

router.post('/', purchaseController.createPurchase);
router.get('/', purchaseController.getPurchases);
router.get('/shop/:shopId', purchaseController.getPurchasesByShop);
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const purchases = await require('../models/boutique/Purchase').find({ productId })
      .populate('shopId', 'name')
      .populate('supplierId', 'name');
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
router.put('/:id', purchaseController.updatePurchase);
router.delete('/:id', purchaseController.deletePurchase);
module.exports = router;
module.exports = router;
