'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Items', {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    lecture: {
        allowNull: false,
        unique:true,
        type: DataTypes.STRING,
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
  }, {timestamps: false});
  Item.associate = function(models) {
    Item.hasMany(models.Memos,{
      foreignKey:'lecture_id',
      sourceKey:'id'
  });
  };
  return Item;
};