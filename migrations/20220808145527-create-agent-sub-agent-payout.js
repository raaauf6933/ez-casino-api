'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('agent_subAgent_payouts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      agent_payout_id: {
        type: Sequelize.INTEGER
      },
      agent_id: {
        type: Sequelize.INTEGER
      },
      comms_rate: {
        type: Sequelize.INTEGER
      },
      initial_salary: {
        type: Sequelize.FLOAT
      },
      sub_agent_salary: {
        type: Sequelize.FLOAT
      },
      admin_fee: {
        type: Sequelize.FLOAT
      },
      upper_to_be_paid: {
        type: Sequelize.FLOAT
      },
      deduction: {
        type: Sequelize.FLOAT
      },
      total_salary: {
        type: Sequelize.FLOAT
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('agent_subAgent_payouts');
  }
};