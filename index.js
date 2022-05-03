const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const express = require("express");
const bodyParser = require("body-parser");
``;
const jsonwebtoken = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 3000;

const connection = require("./database");

//router
const accountRouter = require("./routes/account.js");
const commentRouter = require("./routes/comment.js");
const postRouter = require("./routes/post.js");

const helmet = require("helmet");
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/account", accountRouter);
app.use("/comment", commentRouter);
app.use("/post", postRouter);

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
    jwt.verify(token, "jjh", (err) => {
      if (err) {
        res.status(401).json({ err: "유효하지 않는 토큰입니다." });
      } else {
        next();
      }
    });
  } else if (req.method === "GET" || req.path === "/login") {
    //예외처리
    next();
  } else {
    res.status(401).json({ err: "유효하지 않는 토큰입니다." });
  }
});

//로그인
app.post("/login", async function (req, res) {
  try {
    const user_id = req.body === undefined ? req.user_id : req.body.user_id;
    const user_pw = req.body === undefined ? req.user_pw : req.body.user_pw;

    //DB 에서 검색 유저 ID 검색
    connection.query(
      `select * from user_table where vId="${user_id}"`,
      (err, rows, fields) => {
        if (!rows) {
          res.status(400).send({ err: "존재하지 않는 계정입니다" });
          return 0;
        }

        let user = rows[0];
        crypto.pbkdf2(user_pw, user.vSalt, 100000, 64, "sha512", (err, key) => {
          //salt 이용해 암호화
          if (key.toString("base64") === user.vPwd) {
            let token = jsonwebtoken.sign(
              {
                //jwt 생성
                user_id: user.vId,
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

app.listen(port, () => console.log(`Listening on port ${port}`));
