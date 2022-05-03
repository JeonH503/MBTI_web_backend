var express = require("express");
var router = express.Router();

const conn = require("../database");

router.get("/", function (req, res) {
  try {
    let per_page = req.query.per_page; //페이지당 표시할 내용 갯수
    let page = req.query.page - 1; //페이지

    var sql = `select * from comment limit ${per_page * page},${per_page}`;
    conn.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const id = req.params.id;
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

router.post("/", function (req, res) {
  try {
    const id = req.params.id;
    var post_id = req.body.post_id;
    var user_id = req.body.user_id;
    var description = req.body.description;
    var created_at = req.body.created_at;

    var sql = `insert into comment(post_id, user_id, description, created_at) values(${post_id}, '${user_id}', '${description}', now());`;

    conn.query(sql, (err, rows, fields) => {
      res.send("posted");
    });
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

router.patch("/:id", async function (req, res) {
  try {
    const id = req.params.id;
    var description = req.body.description;

    var sql = `update comment set description='${description}' where id=${id};`;

    conn.query(sql, (err, rows, fields) => {
      res.send("patched");
    });
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    const id = req.params.id;

    var sql = `delete from comment where id=${id};`;

    conn.query(sql, (err, rows, fields) => {
      res.send("deleted");
    });
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

module.exports = router;
