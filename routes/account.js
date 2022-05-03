var express = require("express");
var router = express.Router();

const conn = require("../database");

router.get("/", function (req, res) {
  try {
    var sql = "select * from account";
    conn.query(sql, function (err, rows, fields) {
      if (err) {
        console.log(err);
      } else {
        console.log(rows);
        res.send(rows);
      }
    });
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

router.get("/:id", async function (req, res) {
  try {
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

router.post("/", function (req, res) {
  try {
    var id = req.body.id;
    var mbti = req.body.mbti;
    var salt = req.body.salt;
    var password = req.body.password;

    var sql = `insert into account(id, mbti, salt, password) values('${id}', '${mbti}', '${salt}', '${password}');`;

    conn.query(sql, (err, rows, fields) => {
      res.send("posted");
    });
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

router.patch("/:id", async function (req, res) {
  try {
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

router.delete("/:id", async function (req, res) {
  try {
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

module.exports = router;
