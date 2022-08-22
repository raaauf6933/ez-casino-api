"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("club_payout_batches", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      total_club_fee: {
        type: Sequelize.FLOAT,
      },
      added_by: {
        type: Sequelize.INTEGER,
      },
      // status: {
      //   type: Sequelize.STRING
      // },
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
    await queryInterface.dropTable("club_payout_batches");
  },
};
