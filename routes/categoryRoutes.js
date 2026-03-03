const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// CRUD categories
router.post('/', categoryController.createCategory);      // Create
router.get('/', categoryController.getCategories);        // Read all
router.put('/:id', categoryController.updateCategory);    // Update
router.delete('/:id', categoryController.deleteCategory); // Delete

module.exports = router;
