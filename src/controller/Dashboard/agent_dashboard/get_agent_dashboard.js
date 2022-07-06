const db = require("../../../../models");
const { returnError } = require("../../../common/returnResponse");
const AgentPayout = db.agentPayout;
const Agent = db.agent;

const getRecentEarning = (payouts) => {
  if (payouts.length !== 0) {
    return payouts.length === 1
      ? payouts[0].total_salary
      : payouts[payouts.length - 1].toJson().total_salary;
  } else {
    return 0;
  }
};

const getTotalEarnings = (payouts) => {
  this.total = 0;

  if (payouts.length !== 0) {
    for (let payout of payouts) {
      this.total += payout.total_salary;
    }
    return this.total;
  } else {
    return 0;
  }
};

const GetAgentDashboard = async (req, res) => {
  const agent = req.user;

  try {
    const agentResut = await Agent.findOne({
      where: {
        id: agent._id,
      },
    });

    if (!agentResut) {
      throw Error("Agent not found");
    }

    const subAgents = await Agent.findAll({
      where: {
        added_by_id: agent._id,
        added_by_usertype: "AGENT",
      },
    });

    const result = await AgentPayout.findAll({
      where: {
        agent_id: agent._id,
      },
    });

    const agent_dashboard = {
      recent_earning: parseFloat(getRecentEarning(result)),
      num_agents: subAgents.length,
      total_earnings: parseFloat(getTotalEarnings(result)),
    };

    res.send(agent_dashboard);
  } catch (error) {
    returnError(res, 404, "ERROR", error.message);
  }
};

module.exports = GetAgentDashboard;
