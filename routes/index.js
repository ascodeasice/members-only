var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Message Board' });
});

router.get("/log-in", (req, res) => {
  res.render("log-in", { title: "Log In" });
});

router.get("/sign-up", (req, res) => {
  res.render("sign-up", { title: "Sign Up" })
});

module.exports = router;
