"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addConstraint("agent_subAgent_payouts", {
      fields: ["agent_id"],
      type: "foreign key",
      name: "agent_agentSubAgentPayout_association",
      references: {
        table: "agents",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint(
      "agent_subAgent_payouts",
      "agent_agentSubAgentPayout_association"
    );
  },
};
