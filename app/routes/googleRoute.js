const passport = require('passport');
const express = require('express');
const router = express.Router();

// google auth

router.get('/', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/callback', passport.authenticate('google', {
  successRedirect: '/photoGallery',
  failureRedirect: '/'
}));

module.exports = router;
