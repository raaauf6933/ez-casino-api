"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addConstraint("payout_batches", {
      fields: ["club_id"],
      type: "foreign key",
      name: "payoutBatch_club_association",
      references: {
        table: "Clubs",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint(
      "payout_batches",
      "payoutBatch_club_association"
    );
  },
};
