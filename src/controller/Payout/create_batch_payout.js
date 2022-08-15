/* eslint-disable no-unused-vars */
const db = require("../../../models");
const { userTypes } = require("../../enum");
const { exceptions } = require("../../utils/exception");
const { payout_error_code } = require("./../../common/messages");
const Agents = db.agent;
const Payout = db.payOutBatch;
const AgentPayout = db.agentPayout;
const AgentSubAgentPayout = db.agentSubAgentPayout;
const _ = require("lodash");

const getMyId = async (game_code) => {
  const result = await Agents.findOne({
    attributes: ["id", "comms_rate", "added_by_usertype"],
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

    // agent payout proccess
    for (const payout of payouts) {
      const agent = await getMyId(payout.game_id);
      const parseAgent = agent.toJSON();
      const result = await getMyAgents(parseAgent?.id);
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
          const get_agent_comms_rate = subAgents.find(
            (e) => e.game_code === sub_agents.game_id
          ).comms_rate;

          const sub_agent_comisson = sub_agents.commission;
          const sub_agent_initial_salary =
            parseFloat(sub_agent_comisson) * (get_agent_comms_rate / 100);
          const initial_sub_agent_admin_fee =
            sub_agent_comisson - sub_agent_initial_salary;
          let to_be_paid_to_upper = 0;
          if (sub_agents.admin_rate) {
            to_be_paid_to_upper =
              (sub_agents.admin_rate / 100) * sub_agent_initial_salary;
          } else {
            to_be_paid_to_upper = sub_agent_initial_salary * 0.1;
          }

          total += parseFloat(to_be_paid_to_upper);
        }
        return total;
      };

      const my_commisson = payout.commission;
      // computation of initial salary
      const initial_salary =
        parseFloat(my_commisson) * (parseAgent.comms_rate / 100);
      const sub_agent_salary = getMySubAgentSalary();
      // console.log(`${payout.game_id}`, sub_agent_salary);
      const intial_admin_fee = my_commisson - initial_salary;
      let admin_fee = 0;
      if (parseAgent.added_by_usertype === "AGENT") {
        if (payout.admin_rate) {
          admin_fee =
            intial_admin_fee - initial_salary * (payout.admin_rate / 100);
        } else {
          admin_fee = intial_admin_fee - initial_salary * 0.1;
        }
      } else {
        admin_fee = intial_admin_fee;
      }

      let upper_to_be_paid = 0;
      if (parseAgent.added_by_usertype === "AGENT") {
        if (payout.admin_rate) {
          upper_to_be_paid = (payout.admin_rate / 100) * intial_admin_fee;
        } else {
          upper_to_be_paid = intial_admin_fee * 0.1;
        }
      }
      const total_salary = initial_salary + sub_agent_salary;

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
        upper_to_be_paid: parseFloat(upper_to_be_paid.toFixed(2)),
        sub_agent_salary: parseFloat(sub_agent_salary.toFixed(2)),
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

    for (const agent of forAgentPayouts) {
      delete agent.game_code;
      agent.payout_batch_id = batchResult.id;
    }

    // insert Agent Payouts
    for (const agentPayout of forAgentPayouts) {
      const agentPayoutResult = await AgentPayout.create(agentPayout);
      const getMyAgentsResult = await getMyAgents(agentPayout?.agent_id);

      // get its subAgents
      const subAgents = getMyAgentsResult
        ? getMyAgentsResult.map((e) => e.id)
        : [];

      // get subAgent in Payouts

      const getSubAgent = forAgentPayouts.filter((e) =>
        subAgents.includes(e.agent_id)
      );

      if (getSubAgent.length !== 0) {
        for await (const subAgent of getSubAgent) {
          await AgentSubAgentPayout.create({
            agent_payout_id: agentPayoutResult.toJSON()?.id,
            ..._.omit(subAgent, ["payout_batch_id"]),
          });
        }
      }
    }

    console.log("success bulk");
    // AgentPayout.bulkCreate(forAgentPayouts).then(() =>
    //   console.log("success bulk")
    // );

    res.send({ success: true });
  } catch (error) {
    console.log(error);
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
