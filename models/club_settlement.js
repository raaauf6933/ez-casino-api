'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class club_settlement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  club_settlement.init({
    club_id: DataTypes.INTEGER,
    union_fee: DataTypes.FLOAT,
    union_rate: DataTypes.INTEGER,
    club_earn: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'club_settlement',
  });
  return club_settlement;
};