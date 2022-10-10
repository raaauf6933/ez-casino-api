"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "agent_payouts", // table name
      "union_fee", // new field name
      {
        type: Sequelize.FLOAT,
        allowNull: true,
        after: "sub_agent_salary",
      }
    );
    await queryInterface.addColumn(
      "agent_subAgent_payouts", // table name
      "union_fee", // new field name
      {
        type: Sequelize.FLOAT,
        allowNull: true,
        after: "sub_agent_salary",
      }
    );
    await queryInterface.addColumn(
      "payout_batches", // table name
      "total_union_fee", // new field name
      {
        type: Sequelize.FLOAT,
        allowNull: true,
        after: "total_agent_salary",
      }
    );
    await queryInterface.addColumn(
      "agent_payouts", // table name
      "commission", // new field name
      {
        type: Sequelize.FLOAT,
        allowNull: true,
        after: "payout_batch_id",
      }
    );
    await queryInterface.addColumn(
      "agent_subAgent_payouts", // table name
      "commission", // new field name
      {
        type: Sequelize.FLOAT,
        allowNull: true,
        after: "agent_id",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("agent_payouts", "union_fee");
    await queryInterface.removeColumn("agent_subAgent_payouts", "union_fee");
    await queryInterface.removeColumn("payout_batches", "total_union_fee");
  },
};
