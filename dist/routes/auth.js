"use strict";

var express = require("express");

var authController = require("../controllers/auth");

var router = express.Router();
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/logout", authController.logout);
module.exports = router;