'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Households', {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      relationshipToUser: {
        type: Sequelize.STRING
      },
      profilePicture: {
        type: Sequelize.STRING
      },
      permissionToViewRoom: {
      type: Sequelize.STRING
    },
      createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
      updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
    });
},
  async down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Households');
}
};