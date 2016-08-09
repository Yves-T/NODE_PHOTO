'use strict';

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('../config/config');
const User = require('../models/user').User;

module.exports = () => {

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findByIdAsync(id)
      .then((user) => {
        done(null, user);
      })
      .catch(error => console.error('MongoDB Error: ', error));
  });

  let authProcessor = (accessToken, refreshToken, profile, done) => {
    User.findOneAsync({'google.id': profile.id}).then((result) => {

      if (result) {
        // found user
        done(null, result);
      } else {

        User.createAsync({
          google: {
            id: profile.id,
            token: profile.token,
            email: profile.emails[0].value,
            name: profile.displayName,
            profilePic: profile.photos[0].value || ''
          }
        })
          .then((newAppUser) => {
            done(null, newAppUser);
          })
          .catch(err => {
            console.error('MongoDB Error: >>> ', err);
            throw err;
          });

      }
    })
      .catch(error => {
        console.error('MongoDB Error: ', error);
        done(error);
      });
  };

  passport.use(new GoogleStrategy(config.googleAuth, authProcessor));
};
