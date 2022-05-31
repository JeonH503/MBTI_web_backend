var express = require("express");
var moment = require("moment");
const { send } = require("express/lib/response");
var router = express.Router();

const conn = require("../database");

router.get("/", function (req, res) {
  try {
    // query들 가져오기
    let search_type = req.query.search_type; //검색 타입
    let search = req.query.search; //검색 내용
    let per_page = req.query.per_page; //페이지당 표시할 내용 갯수
    let page = req.query.page - 1; //페이지
    let mbti = req.query.mbti.toLowerCase();

    let sql = `
            select SQL_CALC_FOUND_ROWS *
            from post
            where board_name = "${mbti}"
            ${search ? `AND ${search_type} = '%${search}%'` : ""}
            limit ${per_page * page},${per_page}
        `;

    conn.query(sql, (err, rows, fields) => {
      if (err) {
        res.status(400).send({ err });
        return 0;
      }

      let posts = rows;

      conn.query("SELECT FOUND_ROWS();", (err, rows, fields) => {
        res.send({
          data: posts,
          count: rows[0]["FOUND_ROWS()"],
        });
      });
    });
  } catch (err) {
    res.status(400).send({ err });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const id = req.params.id;
    let sql = `select * from post where id = ${id}`;

    conn.query(sql, (err, rows, fields) => {
      if (err) {
        res.status(400).send({ err });
        return 0;
      } else {
        res.send({ post: rows });
        let sql = `update post set views = views + 1 where id = ${id}`;
        conn.query(sql, (err, rows, fields) => {
          if (err) {
            res.status(400).send({ err });
            return 0;
          } else {
            console.log({ views_update: { result: "성공" } });
          }
        });
      }
    });
  } catch (err) {
    res.status(400).send({ err });
  }
});

router.get("/best/week", function (req, res) {
  try {
    // query들 가져오기
    let search_type = req.query.search_type; //검색 타입
    let search = req.query.search; //검색 내용
    let per_page = req.query.per_page; //페이지당 표시할 내용 갯수
    let page = req.query.page - 1; //페이지
    let mbti = req.query.mbti.toLowerCase();
    var datenow = moment().format("YYYY-MM-DD");
    var datesub = moment().subtract(7, "d").format("YYYY-MM-DD");

    let sql = `
            select SQL_CALC_FOUND_ROWS *
            from post
            where board_name = "${mbti}"
            AND created_at between "${datesub}" AND "${datenow}"
            AND likes >= 10 
            ${search ? `AND ${search_type} = '%${search}%'` : ""}
            limit ${per_page * page},${per_page}
        `;

    conn.query(sql, (err, rows, fields) => {
      if (err) {
        res.status(400).send({ err });
        return 0;
      }

      let posts = rows;

      conn.query("SELECT FOUND_ROWS();", (err, rows, fields) => {
        res.send({
          data: posts,
          count: rows[0]["FOUND_ROWS()"],
        });
      });
    });
  } catch (err) {
    res.status(400).send({ err });
  }
});

router.post("/", function (req, res) {
  try {
    let board_name = req.body.board_name;
    let account_id = req.body.account_id;
    let description = req.body.description;

    let sql = `insert into post(board_name, account_id, created_at, description) values('${board_name}', '${account_id}', now(), '${description}');`;

    conn.query(sql, (err, rows, fields) => {
      if (err) {
        res.status(400).send({ err });
      }

      res.status(200).send({ msg: "ok" });
    });
  } catch (err) {
    res.status(400).send({ err });
  }
});

router.patch("/:id", async function (req, res) {
  try {
    const id = req.params.id;

    let account_id = req.body.account_id;
    let board_name = req.body.board_name;
    let description = req.body.description;

    let sql = `
    update post 
    set description='${description}' ,
    board_name = '${board_name}'
    where id=${id}
    and account_id='${account_id}';`;

    conn.query(sql, (err, rows, fields) => {
      if (err) {
        res.status(400).send({ err });
      }

      res.status(200).send({ msg: "ok" });
    });
  } catch (err) {
    res.status(400).send({ err });
  }
});

//좋아요
router.patch("/like/:id", async function (req, res) {
  try {
    const id = req.params.id;

    var sql = `update post set likes = likes+1 where id = ${id};`;
    conn.query(sql, function (err, rows, fields) {
      if (err) {
        res.status(400).send({ err });
        return 0;
      } else {
        res.send({ patch: { result: "성공" } });
      }
    });
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    const id = req.params.id;

    let sql = `
    delete
    from post
    where id = ${id}
    `;

    conn.query(sql, (err, rows, fields) => {
      if (err) {
        res.status(400).send({ err });
      }

      res.status(200).send({ msg: "ok" });
    });
  } catch (err) {
    res.status(400).send({ err });
  }
});

module.exports = router;
