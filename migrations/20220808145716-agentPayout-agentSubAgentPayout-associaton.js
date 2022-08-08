"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addConstraint("agent_subAgent_payouts", {
      fields: ["agent_payout_id"],
      type: "foreign key",
      name: "agentPayout_agentSubAgentPayout_association",
      references: {
        table: "agent_payouts",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint(
      "agent_subAgent_payouts",
      "agentPayout_agentSubAgentPayout_association"
    );
  },
};
