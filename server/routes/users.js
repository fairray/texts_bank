const express = require('express');
const passport = require('passport');
const { signUp, signIn, getInfo } = require('./../controllers/user');
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/info', passport.authenticate('jwt', { session: false }), getInfo);
module.exports = router;