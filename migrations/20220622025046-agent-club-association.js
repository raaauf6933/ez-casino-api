"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addConstraint("agents", {
      fields: ["club_id"],
      type: "foreign key",
      name: "agent_club_association",
      references: {
        table: "Clubs",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint("agents", "agent_club_association");
  },
};
