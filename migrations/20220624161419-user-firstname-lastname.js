'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     return [await queryInterface.addColumn('Users', 'first_name', {
      type: Sequelize.STRING
     }), await queryInterface.addColumn('Users', 'last_name', {
      type: Sequelize.STRING
     })]
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return [await queryInterface.removeColumn('User', 'first_name'), await queryInterface.removeColumn('Users', 'last_name')]
  }
};
