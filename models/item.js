'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Item', {
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};