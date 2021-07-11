const mysql = require("mysql");

const db = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.create = (req, res) => {
  const { id, message } = req.body;
  db.query(`SELECT * FROM  users WHERE id_u=${id}`, (err, info) => {
    const firstName = info[0].first_name;
    const lasName = info[0].last_name;
    db.query(
      "INSERT INTO post SET ?",
      {
        id_u_fk: id,
        post: message,
        name: `${firstName} ${lasName}`,
      },
      (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.status(200).redirect("/profile");
        }
      }
    );
  });
};
