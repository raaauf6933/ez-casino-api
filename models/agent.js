"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class agent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  agent.init(
    {
      club_id: DataTypes.INTEGER,
      game_code: DataTypes.STRING,
      added_by_id: DataTypes.INTEGER,
      added_by_usertype: DataTypes.STRING,
      comms_rate: DataTypes.INTEGER,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      contact_number: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "agent",
    }
  );
  return agent;
};
