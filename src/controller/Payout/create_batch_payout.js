const db = require("../../../models");
const { userTypes } = require("../../enum");
const { exceptions } = require("../../utils/exception");
const { payout_error_code } = require("./../../common/messages");
const Agents = db.agent;
const Payout = db.payOutBatch;
const AgentPayout = db.agentPayout;

const getMyId = async (game_code) => {
  const result = await Agents.findOne({
    attributes: ["id", "comms_rate"],
    where: {
      game_code,
    },
  });

  return result;
};

const getMyAgents = async (id) => {
  const result = await Agents.findAll({
    where: {
      added_by_id: id,
      added_by_usertype: userTypes.AGENT,
    },
  });

  return result;
};

const getTotalAgentSalary = (forAgentPayouts) => {
  this.total = 0;
  for (const agents of forAgentPayouts) {
    this.total += agents.total_salary;
  }
  return this.total;
};

const getTotalAdminFee = (forAgentPayouts) => {
  this.total = 0;

  for (const agents of forAgentPayouts) {
    this.total += agents.admin_fee;
  }

  return this.total;
};

const getTotalCredit = (forAgentPayouts) => {
  this.total = 0;

  for (const agents of forAgentPayouts) {
    this.total += agents.deduction;
  }

  return this.total;
};

const CreateBatchPayout = async (req, res) => {
  const { payouts } = req.body;
  const user = req.user;
  // console.log(user)

  try {
    let forAgentPayouts = [];

    for (const payout of payouts) {
      const agent = await getMyId(payout.game_id);
      const result = await getMyAgents(agent.toJSON()?.id);
      // get its subAgents
      const subAgents = result ? result.map((e) => e.toJSON()) : [];

      // get subAgent in Payouts
      const getSubAgentInPayroll = payouts.filter(
        (e) =>
          e.game_id ===
          subAgents.find((agents) => agents.game_code === e.game_id)?.game_code
      );

      const getMySubAgentSalary = () => {
        let total = 0;
        if (getSubAgentInPayroll.length === 0) {
          return 0;
        }
        for (const sub_agents of getSubAgentInPayroll) {
          const get_agent_comms = subAgents.find(
            (e) => e.game_code === sub_agents.game_id
          ).comms_rate;
          const agent_comms = get_agent_comms / 100;
          total += parseFloat(sub_agents.commission) * agent_comms * 0.1;
        }
        return total;
      };

      // console.log(e.game_id);
      const initial_salary =
        parseFloat(payout.commission).toFixed(2) *
        (agent.toJSON().comms_rate / 100);
      const admin_fee = parseFloat(
        parseFloat(parseFloat(payout.commission) * 0.3).toFixed(2)
      );
      const total_salary = initial_salary + getMySubAgentSalary();

      if (total_salary < payout.deduction) {
        throw new exceptions(
          false,
          payout_error_code.INVALID_INPUT,
          "Unable to process Data",
          `${payout.game_id} Computed Total Salary must not be less than deduction`
        );
      }

      let agent_payout = {
        game_code: payout.game_id,
        agent_id: agent.toJSON().id,
        comms_rate: agent.toJSON().comms_rate,
        initial_salary: parseFloat(initial_salary.toFixed(2)),
        upper_to_be_paid: parseFloat(
          parseFloat(initial_salary.toFixed(2)) * 0.1
        ),
        sub_agent_salary: parseFloat(getMySubAgentSalary().toFixed(2)),
        admin_fee: admin_fee,
        deduction: parseFloat(payout.deduction),
        total_salary: parseFloat(total_salary.toFixed(2)),
        status: "PENDING",
      };

      console.log(agent_payout.game_code);
      forAgentPayouts.push(agent_payout);
    }

    const total_agent_salary = getTotalAgentSalary(forAgentPayouts).toFixed(2);
    const total_admin_fee = getTotalAdminFee(forAgentPayouts).toFixed(2);
    const total_credit = getTotalCredit(forAgentPayouts).toFixed(2);

    const payout_batch = {
      club_id: user.club_id,
      total_agent_salary: parseFloat(total_agent_salary),
      total_admin_fee: parseFloat(total_admin_fee),
      credit: total_credit,
      total_salary: parseFloat(total_agent_salary) - parseFloat(total_credit),
      added_by: user._id,
      status: "ONGOING",
    };

    // Create Payout Batch
    const batchResult = await Payout.create(payout_batch);

    console.log(batchResult.toJSON());
    for (const agent of forAgentPayouts) {
      delete agent.game_code;
      agent.payout_batch_id = batchResult.id;
    }

    // insert Agent Payouts
    AgentPayout.bulkCreate(forAgentPayouts).then(() =>
      console.log("success bulk")
    );

    res.send({ success: true });
  } catch (error) {
    if (error instanceof exceptions) {
      res.status(400).send({
        code: error.code,
        error: error.error,
        message: error.message,
      });
    } else {
      res.status(404).send({ message: error.message });
    }
  }
};

module.exports = CreateBatchPayout;
