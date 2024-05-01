const express = require('express');
const morgan = require('morgan');

const productsRouter = require('./routes/productsRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use((req, res, next) => {
  console.log(req.body);
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});

app.use('/api/v1/products', productsRouter);

module.exports = app;
