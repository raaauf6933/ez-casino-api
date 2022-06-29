"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class payout_batch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  payout_batch.init(
    {
      club_id: DataTypes.INTEGER,
      total_agent_salary: DataTypes.NUMBER,
      total_admin_fee: DataTypes.NUMBER,
      added_by: DataTypes.NUMBER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "payout_batch",
    }
  );
  return payout_batch;
};
