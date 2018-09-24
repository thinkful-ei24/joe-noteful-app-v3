const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/user');

const router = express.Router();

//POST===============================================================
router.post('/', (req, res, next) => {
  const { fullName, username, password } = req.body;

  if(!username || !password) {
    const err = new Error('Invalid username/password');
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