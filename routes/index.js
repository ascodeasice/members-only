var express = require('express');
var router = express.Router();

const indexController = require("../controllers/indexController");
const authController = require('../controllers/authController');
const messageController = require("../controllers/messageController");

/* GET home page. */
router.get('/', indexController.indexGet);

router.get("/sign-up", authController.signUpGet);

router.post("/sign-up", authController.signUpPost);

router.get("/log-in", authController.logInGet);

router.post("/log-in", authController.logInPost);

router.get("/log-out", authController.logOutGet);

router.get("/create", messageController.createGet);

router.post("/create", messageController.createPost);

router.get("/join-member", authController.joinMemberGet);

router.post("/join-member", authController.joinMemberPost);

router.get("/become-admin", authController.beAdminGet);

router.post("/become-admin", authController.beAdminPost);

router.get("/delete-message/:id", authController.deleteMessageGet);

router.post("/delete-message/:id", authController.deleteMessagePost);

module.exports = router;
