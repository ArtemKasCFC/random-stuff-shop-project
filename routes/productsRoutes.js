const express = require('express');
const productsController = require('../controllers/productsController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(authController.protect, authController.restrictTo('admin'), productsController.createProduct)
  .get(productsController.getAllProducts);
router
  .route('/:id')
  .get(productsController.getProduct)
  .patch(authController.protect, authController.restrictTo('admin'), productsController.updateProduct)
  .delete(authController.protect, authController.restrictTo('admin'), productsController.deleteProduct);

module.exports = router;
