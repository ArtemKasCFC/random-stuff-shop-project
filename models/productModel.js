const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Product must have a name'],
      unique: true,
      trim: true,
      maxlength: [60, 'A product name must have less than or equal to 60 characters'],
      minlength: [10, 'A product name must have more than or equal to 10 characters'],
    },
    summary: {
      type: String,
      required: [true, 'Product must have a summary'],
      trim: true,
      maxlength: [80, 'A product summary must have less than or equal to 80 characters'],
      minlength: [10, 'A product summary must have more than or equal to 10 characters'],
    },
    description: {
      type: String,
      default: function () {
        return this.summary;
      },
      trim: true,
      maxlength: [120, 'A product description must have less than or equal to 120 characters'],
      minlength: [10, 'A product description must have more than or equal to 10 characters'],
    },
    productCategory: {
      type: String,
      enum: {
        values: ['books', 'candy', 'other'],
        message: 'The product category should be either books, candy or other',
      },
      default: 'other',
    },
    slug: String,
    stock: {
      type: Number,
      default: 0,
      min: [0, 'The stock of the product can not be less than 0'],
    },
    regularPrice: {
      type: Number,
      required: [true, 'Product must have a price'],
    },
    discount: {
      type: Number,
      default: 0,
      validate: {
        validator: function (val) {
          return val < this.regularPrice;
        },
        message: 'Product discount should be less than product price',
      },
    },
    mainImage: {
      type: String,
      required: [true, 'Product must have an image'],
    },
    images: [String],
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
