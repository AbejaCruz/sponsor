const express = require("express");
const authController = require("../controllers/auth");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", jsonParser, authController.register);
router.get("/logout", authController.logout);

module.exports = router;
