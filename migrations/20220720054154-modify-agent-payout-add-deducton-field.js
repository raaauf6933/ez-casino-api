"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "agent_payouts", // table name
      "deduction", // new field name
      {
        type: Sequelize.FLOAT,
        allowNull: true,
        after: "upper_to_be_paid",
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("agent_payouts", "deduction");
  },
};
