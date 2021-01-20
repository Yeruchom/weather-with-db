'use strict';
module.exports = (sequelize, DataTypes) => {
  const Emails = sequelize.define('Emails', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type:DataTypes.STRING,
      unique: true,
      validate:{isEmail:true},
    },
    password: DataTypes.STRING
  }, {});
  Emails.associate = function(models) {
    // associations can be defined here
  };
  return Emails;
};