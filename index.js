const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const jsonwebtoken = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 3000;

const connection = require("./database");

//router
const accountRouter = require("./routes/account.js");
const commentRouter = require("./routes/comment.js");
const postRouter = require("./routes/post.js");

const helmet = require("helmet");
const cors = require('cors');

app.use(cors())
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/account", accountRouter);
app.use("/comment", commentRouter);
app.use("/post", postRouter);

// static 설정
app.use('/uploads',express.static('./uploads'))

// multer 설정
const upload = multer({
  dest:"uploads/images"
})

//인증 미들웨어
app.use(function (req, res, next) {
  if (
    req.path !== "/login" &&
    req.headers.authorization &&
    req.headers.authorization !== "undefined"
  ) {
    req.headers.authorization = req.headers.authorization.replace(
        "Bearer ",
        ""
    );
    const token = req.headers.authorization;
    jsonwebtoken.verify(token, "jjh", (err) => {
        if (err) {
                res.status(401).json({ err: "유효하지 않는 토큰입니다." });
        } else {
                next();
        }
    });
  } else if (
        (req.method !== "GET" && req.path === '/account') ||
        req.method === "GET" || 
        req.path === "/login" ||
        (req.method === "GET" && req.path === '/uploads') ||
        (req.path === "/account" && req.method === "POST")
    ) {
    next();
  } else {
    res.status(401).json({ err: "유효하지 않는 토큰입니다." });
  }
});

//로그인
app.post("/login", async function (req, res) {
  try {
    const account_id = req.body === undefined ? req.account_id : req.body.account_id;
    const account_pw = req.body === undefined ? req.account_pw : req.body.account_pw;

    //DB 에서 검색 유저 ID 검색
    connection.query(
      `select * from account where id="${account_id}"`,
      (err, rows, fields) => {
        if (!rows.length) {
          res.status(400).send({ err: "존재하지 않는 계정입니다" });
          return 0;
        }

        let user = rows[0];
        crypto.pbkdf2(account_pw, user.salt, 100000, 64, "sha512", (err, key) => {

            if(err) {
                res.status(400).send({ err: err });
                return 0;
            }

          //salt 이용해 암호화
            if (key.toString("base64") === user.password) {
                let token = jsonwebtoken.sign(
                {
                    //jwt 생성
                    account_id: user.id,
                },
                "jjh",
                {
                    expiresIn: "7d",
                    issuer: "koolsign_access_control",
                    subject: "userInfo",
                }
                );
                res.send({
                  ///토큰 반환
                  token: token,
                  id: user.id,
                  mbti: user.mbti
                });
            } else {
                res.status(400).send({ err: "존재하지 않는 계정입니다" });
            }
        });
      }
    );
  } catch (err) {
    res.status(400).send({ err: "잘못된 형식 입니다." });
  }
});


// uploads API
app.post('/upload/image',upload.single('upload'), function(req, res){
  const image_path = req.file.path
  
  if(!image_path) {
    res.status(400).send({
      error:'이미지가 존재하지 않습니다.'
    })
  }

  res.status(200).send({url:"http://54.180.122.20:3000/"+image_path})
})

app.listen(port, () => console.log(`Listening on port ${port}`));
