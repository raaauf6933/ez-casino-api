"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addConstraint("users", {
      fields: ["club_id"],
      type: "foreign key",
      name: "users_club_association",
      references: {
        table: "Clubs",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint("users", "users_club_association");
  },
};
