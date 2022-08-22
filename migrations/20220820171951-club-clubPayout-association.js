"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("club_payouts", {
      fields: ["club_id"],
      type: "foreign key",
      name: "club_clubPayouts_association",
      references: {
        table: "Clubs",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "club_payouts",
      "club_clubPayouts_association"
    );
  },
};
