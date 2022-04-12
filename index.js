const fs = require('fs');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jsonwebtoken = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);

//router
const accountRouter = require('./routes/account.js');
const commentRouter = require('./routes/comment.js');
const postRouter = require('./routes/post.js');

const connection = mysql.createConnection({
    host : conf.host,
    user : conf.user,
    password : conf.password,
    database : conf.database
});

const helmet = require('helmet')
app.use(helmet())
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/account',accountRouter);
app.use('/comment',commentRouter);
app.use('/post',postRouter);

//인증 미들웨어
app.use(function (req, res, next) {
    if (req.path !== '/login' && req.headers.authorization && req.headers.authorization !== 'undefined') {
        req.headers.authorization = req.headers.authorization.replace('Bearer ','');
        const token = req.headers.authorization;
        jwt.verify(token, 'jjh', (err) => {
            if (err) {
                res.status(401).json({ err: '유효하지 않는 토큰입니다.' });
            } else {
                next();
            }
        });
    }
    //예외 처리 고민 필요
    else if(req.path === '/login' || req.path.indexOf('.jpg') > -1 || req.path.indexOf('.png') > -1 || req.path.indexOf('uploads') > -1 || req.path.indexOf('license_check') > -1){ //예외처리
        next()
    }  
    else {
        res.status(401).json({ err: '유효하지 않는 토큰입니다.' });
    }
});


//로그인
app.post('/login', async function(req, res) {
    try {
        const user_id = req.body === undefined ? req.user_id : req.body.user_id
        const user_pw = req.body === undefined ? req.user_pw : req.body.user_pw
        //DB 에서 검색 코드
        connection.query(
            `select * from user_table where vId="${user_id}"`,
            (err,rows,fields) => {
                if(rows.length === 0) {
                    res.status(400).send({err:"존재하지 않는 계정입니다"})
                    return 0;
                }

                let user = rows[0]
                crypto.pbkdf2(user_pw, user.vSalt, 100000, 64, 'sha512', (err, key) => {
                    if(key.toString('base64') === user.vPwd) {
                        let token = jsonwebtoken.sign({
                                user_id:user.vId,
                            },
                            'jjh',
                            {
                                expiresIn:'7d',
                                issuer: 'koolsign_access_control',
                                subject:'userInfo'
                            }
                        )
                        res.send({
                            "token":token,
                        })
                    } else {
                        res.status(400).send({err:"존재하지 않는 계정입니다"})
                    }
                })  
            })
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});



app.listen(port, () => console.log(`Listening on port ${port}`));