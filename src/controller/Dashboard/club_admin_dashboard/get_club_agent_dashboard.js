const db = require("../../../../models");
const AgentPayout = db.agentPayout;
const Agents = db.agent;

const getTotalAdminFee = (payouts) => {
  this.total = 0;
  for (const payout of payouts) {
    this.total += payout.admin_fee;
  }
  return Number(parseFloat(this.total).toFixed(2));
};

const getAgentsTotalSalary = (payouts) => {
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

    const result = await AgentPayout.findAll({
      include: {
        model: Agents,
        where: {
          club_id: club_admin.club_id,
        },
      },
    });

    const club_admin_dashboard = {
      total_admin_fee: getTotalAdminFee(result),
      total_agents: agentResult ? agentResult.length : 0,
      total_initial_salary: getAgentsTotalSalary(result),
    };

    res.send(club_admin_dashboard);
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = GetClubAgentDashboard;
