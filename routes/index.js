var express = require('express');
var router = express.Router();
var {Items} = require('../models');
/* GET home page. */

router.get('/', function(req, res, next) {
  Items.findAll()
  .then((items)=>{
    //console.log(items);
    res.render('index', {items});
  });
});

module.exports = router;