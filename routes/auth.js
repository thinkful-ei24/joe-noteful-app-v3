const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

const options = {session: false, failWithError: true};
const localAuth = passport.authenticate('local', options);
//POST============================================================
router.post('/', (req, res, next) => {

});

module.exports = router;