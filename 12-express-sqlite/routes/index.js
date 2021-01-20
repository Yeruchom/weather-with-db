var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SQL demo' });
});


//
// router.get('/',(req, res, next) => {
//   console.log("login route");
//   // res.render('login',{
//   //     pageTitel: 'Login',
//   //     path: '/login'
//   // });
//   res.render('register', {
//     pageTitle: 'Register',
//     timeExpired: false,
//     path: '/register',
//   });
//
// });

module.exports = router;
