"use strict";

var express = require("express");

var path = require("path");

var mysql = require("mysql");

var dotenv = require("dotenv");

var cookieParser = require("cookie-parser");

var helpers = require("handlebars-helpers")();

dotenv.config({
  path: "./.env"
});
var app = express();
var port = process.env.PORT || 3000;
var db = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});
var publicDirectory = path.join(__dirname, "./public");
app.set("views", path.join(__dirname, "./views"));
app.use(express["static"](publicDirectory));
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "hbs");
db.getConnection(function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log("MYSQL Connected...");
  }
});
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.use("/post", require("./routes/post"));
app.listen(port, function () {
  console.log("Server started on Port ".concat(port));
});