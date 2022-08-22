"use strict";
const { Model } = require("sequelize");
const db = require("./index");

module.exports = (sequelize, DataTypes) => {
  class Club extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Club.belongsTo(models.users, {
      //   as: "users",
      //   foreignKey: "club_id",
      // });
      // models.users.belongsTo(Club);
      // Club.hasMany(models.agent);
      // models.agent.belongsTo(Club);
    }
  }
  Club.init(
    {
      club_game_id: DataTypes.INTEGER,
      club_name: DataTypes.STRING,
      admin_rate: DataTypes.INTEGER,
      contact_person: DataTypes.STRING,
      mobile_number: DataTypes.STRING,
      email: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Club",
    }
  );

  return Club;
};
