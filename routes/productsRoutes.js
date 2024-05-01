const express = require('express');
const productsController = require('../controllers/productsController');

const router = express.Router();

router.route('/').post(productsController.createProduct);

module.exports = router;
