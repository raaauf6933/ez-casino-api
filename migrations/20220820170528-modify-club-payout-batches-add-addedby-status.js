"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.addColumn(
    //   "club_payout_batches", // table name
    //   "status", // new field name
    //   {
    //     type: Sequelize.STRING,
    //     allowNull: true,
    //     after: "total_club_fee",
    //   }
    // );
    await queryInterface.addColumn(
      "club_payout_batches", // table name
      "added_by", // new field name
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: "status",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.removeColumn("club_payout_batches", "status");
    await queryInterface.removeColumn("club_payout_batches", "added_by");
  },
};
