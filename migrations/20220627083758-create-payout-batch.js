"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payout_batches", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      club_id: {
        type: Sequelize.INTEGER,
      },
      total_agent_salary: {
        type: Sequelize.FLOAT,
      },
      total_admin_fee: {
        type: Sequelize.FLOAT,
      },
      added_by: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("payout_batches");
  },
};
