const express = require('express');
const { validationResult } = require('express-validator');

const userRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireValidEmail,
  requireValidPasswordForUser
} = require('./validators');
const { handleError } = require('./middleware');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  '/signup',
  [ requireEmail, requirePassword, requirePasswordConfirmation ],
  handleError(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body
    const user = await userRepo.create({ email, password });

    // req.session === {} only from cookie-session
    req.session.userId = user.id;

    res.redirect('/admin/products');
});

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out');
});

router.get('/signin', (req, res) => {
  res.send(signinTemplate({}));
});

router.post(
  '/signin',
  [ requireValidEmail, requireValidPasswordForUser ],
  handleError(signinTemplate),
  async (req, res) => {
    const { email } = req.body;
    const user = await userRepo.getOneBy({ email });

    req.session.userId = user.id;

    res.redirect('/admin/products');
});

module.exports = router;