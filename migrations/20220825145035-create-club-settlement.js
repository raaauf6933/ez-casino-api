'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('club_settlements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      club_id: {
        type: Sequelize.INTEGER
      },
      union_fee: {
        type: Sequelize.FLOAT
      },
      union_rate: {
        type: Sequelize.INTEGER
      },
      club_earn: {
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('club_settlements');
  }
};