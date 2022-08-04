"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "payout_batches", // table name
      "credit", // new field name
      {
        type: Sequelize.FLOAT,
        allowNull: true,
        after: "total_admin_fee",
      }
    );
    await queryInterface.addColumn(
      "payout_batches", // table name
      "total_salary", // new field name
      {
        type: Sequelize.FLOAT,
        allowNull: true,
        after: "credit",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("payout_batches", "credit");
    await queryInterface.removeColumn("payout_batches", "total_salary");
  },
};
