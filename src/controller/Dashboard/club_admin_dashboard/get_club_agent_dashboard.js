const db = require("../../../../models");
const { statusType } = require("../../../enum");
const AgentPayout = db.agentPayout;
const PayoutBatch = db.payOutBatch;
const Agents = db.agent;

const getTotalAdminFee = (payouts) => {
  this.total = 0;
  for (const payout of payouts) {
    this.total += payout.total_admin_fee;
  }
  return Number(parseFloat(this.total).toFixed(2));
};

const getAgentsTotalSalary = (payouts) => {
  this.total = 0;
  for (const payout of payouts) {
    this.total += payout.total_agent_salary;
  }
  return Number(parseFloat(this.total).toFixed(2));
};

const getTotalCredit = (payouts) => {
  this.total = 0;
  for (const payout of payouts) {
    this.total += payout.credit;
  }
  return Number(parseFloat(this.total).toFixed(2));
};

const getTotalSalary = (payouts) => {
  this.total = 0;
  for (const payout of payouts) {
    this.total += payout.total_salary;
  }
  return Number(parseFloat(this.total).toFixed(2));
};

const GetClubAgentDashboard = async (req, res) => {
  const club_admin = req.user;

  AgentPayout.belongsTo(Agents, {
    foreignKey: "agent_id",
  });

  try {
    const agentResult = await Agents.findAll({
      where: {
        club_id: club_admin.club_id,
      },
    });

    const result = await PayoutBatch.findAll({
      limit: 1,
      where: {
        club_id: club_admin.club_id,
        status: statusType.COMPLETED,
      },
      order: [["createdAt", "DESC"]],
    });

    const club_admin_dashboard = {
      total_admin_fee: getTotalAdminFee(result),
      total_agents: agentResult ? agentResult.length : 0,
      total_agent_salary: getAgentsTotalSalary(result),
      total_credit: getTotalCredit(result),
      total_salary: getTotalSalary(result),
    };

    res.send(club_admin_dashboard);
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = GetClubAgentDashboard;
