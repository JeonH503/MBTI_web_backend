var express = require("express");
var router = express.Router();

const conn = require("../database");

router.get("/", function (req, res) {
  try {
    let per_page = req.query.per_page; //페이지당 표시할 내용 갯수
    let page = req.query.page - 1;
    let post_id = req.query.post_id;

    var sql = `
    select * 
    from comment 
    where post_id=${post_id}
    order by IF(ISNULL(parent_comment_id), id, parent_comment_id) 
    limit ${per_page * page},${per_page}`;

    console.log(sql)

    conn.query(sql, function (err, rows, fields) {
      if (err) {
        res.status(400).send({ err });
        return 0;
      } else {
        let comments = rows;
        conn.query("SELECT FOUND_ROWS()", (err, rows, fields) => {
          if (err) {
            res.status(400).send({ err });
            return 0;
          } else {
            res.send({
              data: comments,
              count: rows[0]["FOUND_ROWS()"],
            });
          }
        });
      }
    });
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const id = req.params.id;

    var sql = `select * from comment where id=${id};`;
    conn.query(sql, function (err, rows, fields) {
      if (err) {
        res.status(400).send({ err });
        return 0;
      } else {
        res.send({ data: rows });
      }
    });
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

router.post("/", function (req, res) {
  try {
    const id = req.params.id;
    var post_id = req.body.post_id;
    var account_id = req.body.account_id;
    var description = req.body.description;
    var parent_comment_id = req.body.parent_comment_id; 
    var created_at = req.body.created_at;

    if(!parent_comment_id) {
      parent_comment_id = null
    }

    var sql = `insert into comment(post_id, account_id, description, created_at, parent_comment_id) values(${post_id}, '${account_id}', '${description}', now(), ${parent_comment_id});`;

    conn.query(sql, (err, rows, fields) => {
      if (err) {
        res.status(400).send({ err });
        return 0;
      } else {
        var sql = `select last_insert_id();`;

        conn.query(sql, function (err, rows, fields) {
          if (err) {
            res.status(400).send({ err });
            return 0;
          } else {
            var last_insert_id = Object.values(rows[0]);
            var sql = `select * from comment where id=${last_insert_id};`;

            conn.query(sql, function (err, rows, fields) {
              if (err) {
                res.status(400).send({ err });
                return 0;
              } else {
                res.send({ post: { result: "성공" }, comment: rows });
              }
            });
          }
        });
      }
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
      if (err) {
        res.status(400).send({ err });
        return 0;
      } else {
        var sql = `select id, post_id, account_id, description from comment where id=${id};`;

        conn.query(sql, function (err, rows, fields) {
          if (err) {
            res.status(400).send({ err });
            return 0;
          } else {
            res.send({ patch: { result: "성공" }, comment: rows });
          }
        });
      }
    });
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    const id = req.params.id;

    var sql = `select * from comment where id=${id};`;

    conn.query(sql, function (err, rows, fields) {
      if (err) {
        res.status(400).send({ err });
        return 0;
      } else {
        data = rows;
      }
    });

    var sql = `delete from comment where id=${id};`;

    conn.query(sql, (err, rows, fields) => {
      if (err) {
        res.status(400).send({ err });
        return 0;
      } else {
        res.send({ delete: { result: "성공" }, comment: data });
      }
    });
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

module.exports = router;
