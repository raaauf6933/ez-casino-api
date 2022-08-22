"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addConstraint("club_payouts", {
      fields: ["club_payout_batch_id"],
      type: "foreign key",
      name: "clubPayoutBatches_clubPayouts_association",
      references: {
        table: "club_payout_batches",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint(
      "club_payouts",
      "clubPayoutBatches_clubPayouts_association"
    );
  },
};
