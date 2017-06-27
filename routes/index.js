const router = require('express').Router();

module.exports = function(app, sessionMiddleware) {

  // Twitter
  const twitterAuth = require('./twitter.js');
  twitterAuth(app);

  // socket.io routes
  const socketIoRoute = require('./io/index.js')
  socketIoRoute(app, sessionMiddleware);

  // Main SPA entry
  router.get('/', function(req, res, next) {
    res.render('index', {
      title: 'Angular ToDo',
      isLoggedIn: req.user != null,
      user: req.user
    });
  });

  return router;
}
