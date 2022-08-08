'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class agent_subAgent_payout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  agent_subAgent_payout.init({
    agent_payout_id: DataTypes.INTEGER,
    agent_id: DataTypes.INTEGER,
    comms_rate: DataTypes.INTEGER,
    initial_salary: DataTypes.FLOAT,
    sub_agent_salary: DataTypes.FLOAT,
    admin_fee: DataTypes.FLOAT,
    upper_to_be_paid: DataTypes.FLOAT,
    deduction: DataTypes.FLOAT,
    total_salary: DataTypes.FLOAT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'agent_subAgent_payout',
  });
  return agent_subAgent_payout;
};