const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
var helpers = require("handlebars-helpers")();
dotenv.config({ path: "./.env" });

const app = express();
const port = process.env.PORT || 3000;

const db = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const publicDirectory = path.join(__dirname, "./public");
app.set("views", path.join(__dirname, "./views"));
app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(cookieParser());
app.set("view engine", "hbs");

db.getConnection((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MYSQL Connected...");
  }
});

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.use("/post", require("./routes/post"));

app.listen(port, () => {
  console.log(`Server started on Port ${port}`);
});
