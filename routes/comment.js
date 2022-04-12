var express = require('express');
var router = express.Router();

const conn = require('../database')

router.get('/', function (req,res) {
    try {
        
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
})

router.get('/:id',async function(req, res) {
    try {
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.post('/',function(req, res) {
    try {
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.patch('/:id',async function(req, res) {
    try {
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.delete('/:id',async function(req, res) {
    try {
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

module.exports = router;