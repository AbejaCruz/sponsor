"use strict";

var express = require("express");

var postController = require("../controllers/post");

var router = express.Router();
router.post("/create", postController.create, function (req, res) {
  res.redirect("/profile");
});
module.exports = router;