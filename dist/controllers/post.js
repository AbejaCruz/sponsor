"use strict";

var mysql = require("mysql");

var db = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

exports.create = function (req, res) {
  var _req$body = req.body,
      id = _req$body.id,
      message = _req$body.message;
  db.query("SELECT * FROM  users WHERE id_u=".concat(id), function (err, info) {
    var firstName = info[0].first_name;
    var lasName = info[0].last_name;
    db.query("INSERT INTO post SET ?", {
      id_u_fk: id,
      post: message,
      name: "".concat(firstName, " ").concat(lasName)
    }, function (error, results) {
      if (error) {
        console.log(error);
      } else {
        res.status(200).redirect("/profile");
      }
    });
  });
};