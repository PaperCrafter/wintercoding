var express = require('express');
var router = express.Router();
var {Items,Memos, Sequelize} = require('../models');
var Op = Sequelize.Op;
/* GET users listing. */
//input으로 modal 검색을 위한 get
router.get('/search', (req, res, next)=>{
  try{
    console.log(req);
    Items.findAll({
      where:{
        [Op.or]:[
          {
          code: {[Op.like]:"%"+req.query.input+"%"}
        },{
          lecture: {[Op.like]:"%"+req.query.input+"%"}
        },{
          professor: {[Op.like]:"%"+req.query.input+"%"}
        }
      ]}})
    .then((items)=>{
        res.render('index',{items});
      }
    );
  }catch(error){
    console.log(error);
    next(error);
  }
});

//강의 테이블에 추가된 item만 반환
router.get('/with/memos', (req, res, next)=>{
  try{
    Items.findAll({
      include:{
        model:Memos,
      },
      raw:true,
      where:{
        isAdded:1
      }
    })
    .then((items)=>{
        console.log(items);
        res.send(items);
      }
    );
  }catch(error){
    console.log(error);
    next(error);
  }
});

//modal을 클릭했을 경우 항목을 보여주기 위한 get
router.get('/:id', (req, res, next)=>{
  try{
    Items.findOne({where:{id:req.params.id}})
    .then((item)=>{
        console.log(item);
        res.json(item);
      }
    );
  }catch(error){
    console.log(error);
    next(error);
  }
});


//item 중복검사를 위한 get
router.post('/check-duplicated', (req, res, next)=>{
  try{
    console.log(req.body.start_time);
    console.log(req.body.end_time);
    if(req.body.dayofweek2 == '') req.body.dayofweek2 = req.body.dayofweek1;
    Items.count({
      where:{
        [Op.and]:[{
          [Op.or]:[{
          dayofweek1:{
            [Op.or]:[req.body.dayofweek1, req.body.dayofweek2]
          }},{
          dayofweek2:{
            [Op.or]:[req.body.dayofweek1, req.body.dayofweek2]
          }}],
        },{
          [Op.or]:[{
            start_time:{
              [Op.and]:[
                {[Op.gte]:req.body.start_time},
                {[Op.lt]:req.body.end_time}
              ]
            }},{
            end_time:{
              [Op.and]:[
                {[Op.gt]:req.body.start_time},
                {[Op.lte]:req.body.end_time}
              ]
            }}
          ]
        }],
        isAdded : true
      }
    })
    .then((number)=>{
      console.log(number);
      if(number==0){
        res.send({status:true});
      }else{
        res.send({status:false});
      }
    });
  }catch(error){
    console.log(error);
    next(error);
  }
});

//강의 테이블에 item 하나 추가
router.patch('/:id/register', (req, res, next)=>{
  console.log(req.params.code);
  try{
    Items.update({isAdded: 1},{
      where:{id:req.params.id}
    })
    .then((items)=>{
      console.log(items);
      res.send(items);
      }
    )
  }catch(error){
    console.log(error);
    next(error);
  }
});

//time-table에 존재하는 item을 제거
router.patch('/:id/unregister', (req, res, next)=>{
  console.log(req.params.id);
  try{
    Items.update({isAdded: 0},{
      where:{id:req.params.id}
    })
    .then((items)=>{
      console.log(items);
      res.send(items);
    });
  }catch(error){
    console.log(error);
    next(error);
  }
});

module.exports = router;
