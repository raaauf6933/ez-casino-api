"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "Clubs", // table name
      "club_game_id", // new field name
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: "id",
      }
    );
    await queryInterface.addColumn(
      "Clubs", // table name
      "admin_rate", // new field name
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: "club_name",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Clubs", "club_game_id");
    await queryInterface.removeColumn("Clubs", "admin_rate");
  },
};
