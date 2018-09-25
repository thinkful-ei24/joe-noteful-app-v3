const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_EXPIRY} = require('../config');

const User = require('../models/user');

const router = express.Router();

const options = {session: false, failWithError: true};
const localAuth = passport.authenticate('local', options);

function createAuthToken (user) {
  return jwt.sign({user}, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

//POST============================================================
router.post('/', localAuth, (req, res, next) => {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

module.exports = router;