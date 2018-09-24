const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/user');

const router = express.Router();

//POST===============================================================
router.post('/', (req, res, next) => {
  const { fullName, username, password } = req.body;
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));
  
  if (missingField) {
    const err = new Error(`Missing ${missingField} in request body`);
    err.status = 422;
    return next(err);
  }

  
  if(!username || !password) {
    const err = new Error('Invalid username/password');
    err.status = 400;
    next(err);
  }
  
  if (typeof username !== 'string' || typeof password !== 'string') {
    const err = new Error('Username or password are not valid characters');
    err.status = 400;
    return next(err);
  }

  if (username.indexOf(' ') === 0 || 
      username.indexOf(' ') === username.length - 1 ||
      password.indexOf(' ') === 0 || 
      password.indexOf(' ') === password.length - 1) {
    const err = new Error('No whitespace allowed before or after username/password');
    err.status = 400;
    next(err);
  }

  if (username.length <= 1 || password.length <= 8 || password.length >= 72) {
    const err = new Error('username must be at least 1 character long, password should be at least 8 or 72 max');
    err.status = 400;
    next(err);
  }

  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        fullName
      };
      return User.create(newUser);
    })
    .then(result => {
      res.status(201).location(`/api/users/${result.id}`).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username is taken');
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;