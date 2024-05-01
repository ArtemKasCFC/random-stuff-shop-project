// const catchAsync = require('../utils/catchAsync');
const crudController = require('./crudController');
const Product = require('../models/productModel');

exports.createProduct = crudController.createOne(Product);
exports.getProduct = crudController.getOne(Product);
exports.getAllProducts = crudController.getAll(Product);
exports.updateProduct = crudController.updateOne(Product);
exports.deleteProduct = crudController.deleteOne(Product);
