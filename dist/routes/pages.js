"use strict";

var express = require("express");

var authController = require("../controllers/auth");

var router = express.Router();
router.get("/", authController.isLoggedIn, function (req, res) {
  res.render("index", {
    user: req.user
  });
});
router.get("/register", function (req, res) {
  res.render("register");
});
router.get("/login", function (req, res) {
  res.render("login");
});
router.get("/profile", authController.isLoggedIn, function (req, res) {
  if (req.user) {
    res.render("profile", {
      user: req.user,
      info: req.info
    });
  } else {
    res.redirect("/login");
  }
});
module.exports = router;