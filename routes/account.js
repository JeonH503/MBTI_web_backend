var express = require("express");
var router = express.Router();

const crypto = require("crypto");
const conn = require("../database");

router.get("/", function (req, res) {
  try {
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
        let id = String(req.body.id);
        let password = String(req.body.password);
        let mbti = String(req.body.mbti);
        let salt = "";

        if(!id && !password && !mbti)
            res.status(400).send("잘못된 형식입니다")

        crypto.randomBytes(64, (err, buf) => {
            crypto.pbkdf2(password, buf.toString('base64'), 100000, 64, 'sha512', (err, key) => {
                let incoded_password = key.toString('base64');
                salt = buf.toString('base64');
                let sql = `INSERT INTO account(id, mbti, salt, password) VALUES ('${id}','${mbti}','${salt}','${incoded_password}')`
                
                conn.query(sql, (err, rows, fields) => {
                    if(err) {
                        res.status(400).send({ err })
                    }

                    res.status(201).send("ok");
                })
            });
        });  
    } catch (err) {
        res.status(400).send({ err });
    }
});

router.patch("/:id", async function (req, res) {
  try {
    let id = String(req.params.id);
    let password = String(req.body.password);
    let mbti = String(req.body.mbti);
    let salt = "";

    if(!id && !password && !mbti)
        res.status(400).send("잘못된 형식입니다")

    crypto.randomBytes(64, (err, buf) => {
        crypto.pbkdf2(password, buf.toString('base64'), 100000, 64, 'sha512', (err, key) => {
            let incoded_password = key.toString('base64');
            salt = buf.toString('base64');
            let sql = `INSERT INTO account(id, mbti, salt, password) VALUES ('${id}','${mbti}','${salt}','${incoded_password}')`
            let sql = `
            update
            from account
            set mbti=${mbti},
            salt=${salt},
            passsword=${incoded_password}
            `
            conn.query(sql, (err, rows, fields) => {
                if(err) {
                    res.status(400).send({ err })
                }

                res.status(201).send("ok");
            })
        });
    });  
  } catch (err) {
      res.status(400).send({ err });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});

module.exports = router;
