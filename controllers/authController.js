const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  user.password = undefined;
  user.role = undefined;

  res.status(statusCode).json({
    status: 'succes',
    token,
    data: user,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, avatar, password, passwordConfirm } = req.body;

  const newUser = await User.create({
    name,
    email,
    avatar,
    password,
    passwordConfirm,
  });

  createSendToken(newUser, 201, req, res);
});
