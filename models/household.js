'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Household extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Household.init({
    username: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    relationshipToUser: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    permissionToViewRoom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Household',
  });
  return Household;
};