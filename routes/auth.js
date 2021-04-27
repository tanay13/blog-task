var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
bodyParser = require('body-parser');
const User = require('../model/user');
var jwt = require('jsonwebtoken');
const passport = require('passport');

const { createToken, expiry } = require('../utils/token');

//Google login routes ----------------------------

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/failed' }),
  (req, res) => {
    console.log(req.user);

    User.findOne({ email: req.user.email }, function (err, user) {
      if (err) {
        return console.log(err);
      } else if (user) {
        const token = createToken(user._id, user.email);
        res.cookie('jwt', token, { httpOnly: true, expiry: expiry * 1000 });
        return res.redirect('/blogs/landing');
      } else {
        var newUser = new User({
          username: req.user.displayName,
          email: req.user.email,
          password: req.user.id,
        });
        User.create(newUser, function (err, user) {
          if (err) {
            return console.log(err);
          }
          const token = createToken(user._id, user.email);
          res.cookie('jwt', token, { httpOnly: true, expiry: expiry * 1000 });
          res.redirect('/blogs/landing');
          console.log(token);
        });
      }
    });
  }
);

//facebook login routes ------------------------------------

router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/failed' }),
  (req, res) => {
    User.findOne({ email: req.user.emails[0].value }, function (err, user) {
      if (err) {
        return console.log(err);
      } else if (user) {
        const token = createToken(user._id, user.email);
        res.cookie('jwt', token, { httpOnly: true, expiry: expiry * 1000 });
        return res.redirect('/blogs/landing');
      } else {
        var newUser = new User({
          username: req.user.displayName,
          email: req.user.emails[0].value,
          password: req.user.id,
        });
        User.create(newUser, function (err, user) {
          if (err) {
            return console.log(err);
          }
          const token = createToken(user._id, user.email);
          res.cookie('jwt', token, { httpOnly: true, expiry: expiry * 1000 });
          res.redirect('/blogs/landing');
        });
      }
    });
  }
);

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, function (err, user) {
    if (err) {
      return console.log(err);
    } else if (user && password === user.password) {
      const token = createToken(user._id, user.email);
      res.cookie('jwt', token, { httpOnly: true, expiry: expiry * 1000 });
      res.redirect('/blogs/landing');
    } else {
      res.redirect('/auth/register');
    }
  });
});

//manual login routes--------------------------------------------

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', function (req, res) {
  var newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  User.create(newUser, function (err, user) {
    if (err) {
      return console.log(err);
    }
    const token = createToken(user._id, user.email);
    res.cookie('jwt', token, { httpOnly: true, expiry: expiry * 1000 });
    res.redirect('/blogs/landing');
  });
});

router.get('/logout', (req, res) => {
  res.cookie('jwt', '', { expiry: 1 });
  res.redirect('/auth/login');
});

module.exports = router;
