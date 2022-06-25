"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.removeColumn("Containers", "box", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.addColumn("Containers", "box");
  },
};
