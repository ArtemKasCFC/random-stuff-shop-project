const mongoose = require('mongoose');
const validator = require('validator');
const passwordValidator = require('password-validator');
const bcrypt = require('bcryptjs');
const schema = new passwordValidator();
schema
  .is()
  .min(8, 'Password must have at least 8 characters')
  .is()
  .max(20, 'Password length must not exceed 20 characters')
  .has()
  .lowercase(1, 'Password must have at least 1 lowercase letter')
  .has()
  .uppercase(1, 'Password must have at least 1 uppercase letter')
  .has()
  .digits(1, 'Password must have at least 1 digit')
  .has()
  .symbols(1, 'Password must have at least 1 special character')
  .has()
  .not()
  .spaces(null, 'Password must not contain spaces')
  .not(/[~'!()*"`]/, 'Password must not have the following characters ~\'!()*"`');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    requried: [true, 'Please type your name'],
    minLength: [2, 'Name must have at least 2 characters'],
    maxLength: [60, 'Name length must not exceed 60 characters'],
    validate: {
      validator: function () {
        return /^[a-zA-Z]+$/.test(this.name);
      },
      message: 'Please type your name in English',
    },
  },
  email: {
    type: String,
    required: [true, 'Please type your email'],
    unique: true,
    lowercase: true,
    minLength: [6, 'Email must have at least 6 characters'],
    maxLength: [60, 'Email length must not exceed 60 characters'],
    validate: {
      validator: function () {
        return validator.isEmail(this.email, { allow_utf8_local_part: false, ignore_max_length: false });
      },
      message: 'Please provide a valid email',
    },
  },
  avatar: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    select: false,
    validate: {
      validator: val => {
        const errorsArray = schema.validate(val, { details: true, list: true });
        if (errorsArray.length > 0) throw new Error(errorsArray.map(msg => msg.message).join(', '));
      },
    },
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.comparePasswords = async (candidatePassword, userPassword) =>
  await bcrypt.compare(candidatePassword, userPassword);

userSchema.methods.checkPasswordChangingTime = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
