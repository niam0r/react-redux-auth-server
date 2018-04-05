const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// setup options for JWT stratregy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // done is a fn callback from jwt, first arg is error object
  // see if the user ID in the payload exist in the DB
  // if it does, call 'done' with that user
  // otherwise call done without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false ); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// tell passport to use this strategy
passport.use(jwtLogin);