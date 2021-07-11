const express = require("express");
const postController = require("../controllers/post");

const router = express.Router();

router.post("/create", postController.create, (req, res) => {
  res.redirect("/profile");
});

module.exports = router;
