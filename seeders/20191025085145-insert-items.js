'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let datas = [];
    for(let i = 0; i < 10; i++){
      let obj = {
        name: "item" + i,
        quantity: 10,
        createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      }
      datas.push(obj)
    }

    return queryInterface.bulkInsert('Items', datas, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
