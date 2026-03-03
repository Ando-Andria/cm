const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

// Routes pour les fournisseurs
router.post('/', supplierController.createSupplier);
router.get('/', supplierController.getSuppliers);
router.put('/:id', supplierController.updateSupplier);

module.exports = router;