const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const customerController = require('../controllers/customerController');
router.post('/register', register);
router.post('/login', login);
router.post('/registerClient', customerController.registerCustomer);
router.post('/loginClient', customerController.loginCustomer);

module.exports = router;
