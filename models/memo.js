'use strict';
module.exports = (sequelize, DataTypes) => {
  const Memo = sequelize.define('Memos',  {
    lecture: {
      allowNull: false,
      type: DataTypes.STRING,
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
        foreignKey:'lecture'
    })
  };
  Memo.removeAttribute('id');
  return Memo;
};