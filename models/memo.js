'use strict';
module.exports = (sequelize, DataTypes) => {
  const Memo = sequelize.define('Memos',  {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    lecture_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    title: {
        allowNull: false,
        type: DataTypes.STRING
    },
    discription: {
        allowNull: false,
        type: DataTypes.STRING
    }
  }, {timestamps: false});
  Memo.associate = function(models) {
    Memo.belongsTo(models.Items, {
        foreignKey:'lecture_id',
        targetKey:'id'
    })
  };
  return Memo;
};