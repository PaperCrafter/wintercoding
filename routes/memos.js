var express = require('express');
var router = express.Router();
var {Items, Memos, Sequelize} = require('../models');
var Op = Sequelize.Op;

//메모 추가
router.post('/insert_memo', (req, res, next)=>{
    console.log(req);
    console.log(req.body.lecture);
    Memos.create({
        lecture:req.body.lecture,
        title: req.body.title,
        discription:req.body.discription    
    })
    .then((memos)=>{
        console.log(memos);
        res.json(memos);
      }
    );
});

//한 과목에 해당하는 메모를 찾을 때 사용하는 api입니다.
router.get('/get_memo', (req, res, next)=>{
    console.log(req);
    console.log(req.query.lecture);
    Memos.findAll({
        where:{lecture:req.query.lecture}
    })
    .then((memos)=>{
        console.log(memos);
        res.json(memos);
      }
    );
});

//한 과목에 해당하는 메모를 찾을 때 사용하는 api입니다.
router.delete('/delete_memo', (req, res, next)=>{
    Memos.destroy({
        where:{
            lecture:req.body.lecture,
            title:req.body.title
        }
    })
    .then((memos)=>{
        console.log(memos);
        res.json(memos);
      }
    );
});

module.exports = router;