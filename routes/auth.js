const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

const options = {session: false, failWithError: true};
const localAuth = passport.authenticate('local', options);

//POST============================================================
router.post('/', localAuth, (req, res, next) => {
  return res.json(req.user);
});

module.exports = router;