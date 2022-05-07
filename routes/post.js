var express = require("express");
var router = express.Router();

const conn = require("../database");

router.get("/", function (req, res) {
  try {
    // query들 가져오기
    let search_type = req.query.search_type; //검색 타입
    let search = req.query.search; //검색 내용
    let per_page = req.query.per_page; //페이지당 표시할 내용 갯수
    let page = req.query.page - 1; //페이지

    let sql = `
            select *
            from post
            ${search ? `where ${search_type} = '%${search}%'` : ""}
            limit ${per_page * page},${per_page}
        `;

    conn.query(sql, (err, rows, fields) => {
      res.send(rows);
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
    let board_name = req.body.board_name;
    let account_id = req.body.account_id;
    let description = req.body.description;

    let sql = `insert into post(board_name, account_id, created_at, description) values('${board_name}', '${account_id}', now(), '${description}');`;

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
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    const id = req.params.id;
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

module.exports = router;
