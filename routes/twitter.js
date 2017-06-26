const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user.js').model;
const keys = require('../private/keys.json');

module.exports = function(app) {

  app.get('/logout', (req, res) => {
    req.session.destroy( (err) => {
      res.redirect('/');
    });
  });

  passport.use(new TwitterStrategy({
      consumerKey: keys.twitter.consumerKey,
      consumerSecret: keys.twitter.consumerSecret,
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {

      User.findOne({
        token: token,
        tokenSecret: tokenSecret
      }).then( (account) => {

        if(account) {
          console.log('[Twitter] Welcome back ' + account.profile.displayName);
          return done(null, account);
        }

        let newAccount = User.create({
          token: token,
          tokenSecret: tokenSecret,
          profile: profile,
          source: 'Twitter'
        }, function(err, doc) {
          if(err) {
            console.log(err);
            return done(err);
          }

          console.log('[Twitter] Hello ' + doc.profile.displayName);
          return done(null, doc);
        });

      }).catch( (err) => {
        console.log(err);
        return done(err);
      })

    }
  ));

  passport.serializeUser(function(user, done) {

    // remove profile info
    //user.profile = undefined;

    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  // Redirect the user to Twitter for authentication.  When complete, Twitter
  // will redirect the user back to the application at
  //   /auth/twitter/callback
  app.get('/auth/twitter', passport.authenticate('twitter'));

  // Twitter will redirect the user to this URL after approval.  Finish the
  // authentication process by attempting to obtain an access token.  If
  // access was granted, the user will be logged in.  Otherwise,
  // authentication has failed.
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { successRedirect: '/',
                                       failureRedirect: '/' }));

};
