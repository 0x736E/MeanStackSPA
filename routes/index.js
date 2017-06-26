var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  //console.log(req.session);
  //console.log(req.user);

  res.render('index', {
    title: 'Angular ToDo',
    isLoggedIn: req.user != null,
    user: req.user
  });

});

module.exports = router;
