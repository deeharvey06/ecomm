const { check } = require('express-validator');
const userRepo = require('../../repositories/users');

module.exports = {
  requireTitle: check('title')
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage('Must be between 5 and 40 characters')
  ,
  requirePrice: check('price')
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage('Must be a number greater than 1')
  ,
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom(async (email) => {
      const existingUser = await userRepo.getOneBy({ email });
      if (existingUser) throw new Error('Email in use');
    })
  ,
  requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 abd 20 characters')
  ,
  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 abd 20 characters')
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) throw new Error('Password must match');
    })
  ,
  requireValidEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom(async (email) => {
      const existingUser = await userRepo.getOneBy({ email });
      if (existingUser) throw new Error('Email not Found');
    })
  ,
  requireValidPasswordForUser: check('password')
    .trim()
    .custom(async (password, { req }) => {
      const user = await userRepo.getOneBy({ email: req.body.email });

      if (!user) throw new Error('Invaild password');
      const vaildPassword = userRepo.comparePassword(user.password, password);

      if (!vaildPassword) throw new Error('Invaild password');
    })
  ,
}