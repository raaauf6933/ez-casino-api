"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addConstraint("agent_payouts", {
      fields: ["agent_id"],
      type: "foreign key",
      name: "agentPayout_agent_association",
      references: {
        table: "agents",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint(
      "agent_payouts",
      "agentPayout_agent_association"
    );
  },
};
