'use strict';
module.exports = {
  up: (queryInterface, DataTypes) => {
    return Promise.all([
    queryInterface.createTable('Items', {
      id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      code: {
        allowNull: false,
        unique:true,
        type: DataTypes.STRING
      },
      lecture: {
          allowNull: false,
          unique:true,
          type: DataTypes.STRING
      },
      professor: {
          allowNull: false,
          type: DataTypes.STRING
      },
      location: {
          allowNull: false,
          type: DataTypes.STRING
      },
      start_time: {
          allowNull: false,
          type: DataTypes.STRING
      },
      end_time: {
          allowNull: false,
          type: DataTypes.INTEGER
      },
      dayofweek1: {
          allowNull: false,
          type: DataTypes.STRING
      },
      dayofweek2: {
        allowNull: true,
        type: DataTypes.STRING
      },
      discription:{
          allowNull : true,
          type: DataTypes.STRING
      },
      isAdded:{
        allowNull : true,
        type: DataTypes.BOOLEAN
      }
    }),
    queryInterface.createTable('Memos', {
      id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      lecture_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Items",
          key: "id"
        }
      },
      title: {
          allowNull: false,
          type: DataTypes.STRING
      },
      discription: {
          allowNull: false,
          type: DataTypes.STRING
      },
    })
  ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.dropTable('Memos'),
      queryInterface.dropTable('Items')]) 
  }
};