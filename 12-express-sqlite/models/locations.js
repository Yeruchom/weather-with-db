'use strict';
module.exports = (sequelize, DataTypes) => {
  const Locations = sequelize.define('Locations', {
    user: DataTypes.INTEGER,
    address: DataTypes.STRING,
    lon: DataTypes.STRING,
    lat: DataTypes.STRING
  }, {});
  Locations.associate = function(models) {
    // associations can be defined here
  };
  return Locations;
};