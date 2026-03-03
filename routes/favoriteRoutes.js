const express = require('express');
const router = express.Router();
const { toggleFavorite } = require('../controllers/favoriteController');
const { getFavorites } = require('../controllers/favoriteController');


router.post('/toggle', toggleFavorite);
router.get('/user/:userId', getFavorites);   

module.exports = router;