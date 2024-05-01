const catchAsync = require('../utils/catchAsync');
const Product = require('../models/productModel');

exports.createProduct = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const product = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    product,
  });
});
