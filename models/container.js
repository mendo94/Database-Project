"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Container extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Container.hasMany(models.Item, {
        as: "item",
        foreignKey: "containerId",
      });

      models.Container.belongsTo(models.Room, {
        as: "room",
        foreignKey: "roomId",
      });
    }
  }
  Container.init(
    {
      box: DataTypes.STRING,
      roomId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Container",
    }
  );
  return Container;
};
