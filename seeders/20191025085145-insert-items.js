'use strict';
var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'courses.csv');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let datas = fs.readFileSync(filePath, {encoding :"utf8"});
    let rows = datas.split("\n");
    var result=[];
    for(var rowIndex in rows){
      var row = rows[rowIndex].split(",");
      if(rowIndex==="0"){var columns = row;}
      else{
        if(row[6].length > 1){
          row[7] = row[6].substr(1,1);
          row[6] = row[6].substr(0,1);
        }else{
          row[7] = null;
        }
        let obj = {
          id:rowIndex,
          code: row[0],
          lecture: row[1],
          professor: row[2],
          location:row[3],
          start_time:row[4],
          end_time:row[5],
          dayofweek1:row[6],
          dayofweek2:row[7],
        }
        result.push(obj)
      }
    }

    return queryInterface.bulkInsert('Items', result, {});
  },

  down: (queryInterface, Sequelize) => {

  }
};
