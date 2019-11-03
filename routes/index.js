var express = require('express');
var router = express.Router();
var {Items} = require('../models');
/* GET home page. */

router.get('/', function(req, res, next) {
  try{
    Items.findAll()
    .then((items)=>{
      //console.log(items);
      res.render('index', {items});
    });
  }catch(error){
    console.log(error);
    next(error);
  }
});

module.exports = router;