var express = require('express');
var router = express.Router();
var {Items, Memos, Sequelize} = require('../models');
var Op = Sequelize.Op;

//메모 추가
router.post('/', (req, res, next)=>{
    try{
        console.log(req.body.lecture_id);
        Memos.create({
            lecture_id:req.body.lecture_id,
            title: req.body.title,
            discription:req.body.discription    
        })
        .then((memos)=>{
            console.log(memos);
            res.json(memos);
        }
        );
    }catch(error){
        console.log(error);
        next(error);
    }
});

//한 과목에 해당하는 메모를 찾을 때 사용하는 api입니다.
router.get('/:id', (req, res, next)=>{
    try{
        console.log(req.params.id);
        Memos.findAll({
            where:{lecture_id:req.params.id}
        })
        .then((memos)=>{
            console.log(memos);
            res.json(memos);
        }
        );
    }catch(error){
        console.log(error);
        next(error);
    }
});

//한 과목에 해당하는 메모를 찾을 때 사용하는 api입니다.
router.delete('/:id', (req, res, next)=>{
    try{
        Memos.destroy({
            where:{
                id:req.params.id,
            }
        })
        .then((memos)=>{
            console.log(memos);
            res.json(memos);
        }
        );
    }catch(error){
        console.log(error);
        next(error);
    }
});

module.exports = router;