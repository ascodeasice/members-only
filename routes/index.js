var express = require('express');
var router = express.Router();

const indexController = require("../controllers/indexController");
const authController = require('../controllers/authController');

/* GET home page. */
router.get('/', indexController.indexGet);

router.get("/sign-up", authController.signUpGet);

router.post("/sign-up", authController.signUpPost);

router.get("/log-in", authController.logInGet);

router.post("/log-in", authController.logInPost);

router.get("/log-out", authController.logOutGet);

module.exports = router;
