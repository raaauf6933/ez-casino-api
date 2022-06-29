"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addConstraint("agent_payouts", {
      fields: ["payout_batch_id"],
      type: "foreign key",
      name: "payoutBatch_agentPayout_association",
      references: {
        table: "payout_batches",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint(
      "agent_payouts",
      "payoutBatch_agentPayout_association"
    );
  },
};
