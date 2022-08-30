"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "club_settlements", // table name
      "club_payout_batch_id", // new field name
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: "club_id",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "club_settlements",
      "club_payout_batch_id"
    );
  },
};
