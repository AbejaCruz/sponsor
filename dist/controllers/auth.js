"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var mysql = require("mysql");

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var _require = require("util"),
    promisify = _require.promisify;

var db = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

exports.register = function (req, res) {
  var _req$body = req.body,
      first_name = _req$body.first_name,
      last_name = _req$body.last_name,
      email = _req$body.email,
      password = _req$body.password,
      passwordConfirm = _req$body.passwordConfirm;
  db.query("SELECT email FROM users WHERE email = ?", [email], /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(error, results) {
      var hashedPassword;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (error) {
                console.log(error);
              }

              if (!(results.length > 0)) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return", res.render("register", {
                message: "That email is already in use"
              }));

            case 5:
              if (!(password !== passwordConfirm)) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return", res.render("register", {
                message: "Passwords do not match"
              }));

            case 7:
              _context.next = 9;
              return bcrypt.hash(password, 8);

            case 9:
              hashedPassword = _context.sent;
              console.log(hashedPassword);
              db.query("INSERT INTO users SET ?", {
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: hashedPassword
              }, function (error, results) {
                if (error) {
                  console.log(error);
                } else {
                  return res.render("register", {
                    message: "User registered"
                  });
                }
              });

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

exports.login = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var _req$body2, email, password;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;

            if (!(!email || !password)) {
              _context3.next = 4;
              break;
            }

            return _context3.abrupt("return", res.status(400).render("login", {
              message: "Please provide an email and password"
            }));

          case 4:
            db.query("SELECT * FROM users WHERE email = ?", [email], /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(error, results) {
                var id, token, cookieOptions;
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.t0 = !results;

                        if (_context2.t0) {
                          _context2.next = 5;
                          break;
                        }

                        _context2.next = 4;
                        return bcrypt.compare(password, results[0].password);

                      case 4:
                        _context2.t0 = !_context2.sent;

                      case 5:
                        if (!_context2.t0) {
                          _context2.next = 9;
                          break;
                        }

                        res.status(401).render("login", {
                          message: "Email or Password is incorrect"
                        });
                        _context2.next = 15;
                        break;

                      case 9:
                        id = results[0].id_u;
                        token = jwt.sign({
                          id: id
                        }, process.env.JWT_SECRET, {
                          expiresIn: process.env.JWT_EXPIRES_IN
                        });
                        console.log("The token is: " + token);
                        cookieOptions = {
                          expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                          httpOnly: true
                        };
                        res.cookie("jwt", token, cookieOptions);
                        res.status(200).redirect("/");

                      case 15:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x5, _x6) {
                return _ref3.apply(this, arguments);
              };
            }());
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.isLoggedIn = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var decoded;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!req.cookies.jwt) {
              _context4.next = 14;
              break;
            }

            _context4.prev = 1;
            _context4.next = 4;
            return promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

          case 4:
            decoded = _context4.sent;
            db.query("SELECT * FROM users WHERE id_u = ?", [decoded.id], function (error, result) {
              if (!result) {
                return next();
              }

              db.query("SELECT * FROM post", function (err, results, fields) {
                req.user = result[0];
                var info = results.reverse();
                req.info = info;
                return next();
              });
            });
            _context4.next = 12;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](1);
            console.log(_context4.t0);
            return _context4.abrupt("return", next());

          case 12:
            _context4.next = 15;
            break;

          case 14:
            next();

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 8]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();

exports.logout = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            res.cookie("jwt", "logout", {
              expires: new Date(Date.now() + 2 * 1000),
              httpOnly: true
            });
            res.status(200).redirect("/");

          case 2:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}();