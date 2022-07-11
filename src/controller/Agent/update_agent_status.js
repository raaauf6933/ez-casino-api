const db = require("../../../models");
const { returnError } = require("../../common/returnResponse");
const Agent = db.agent;

const UpdateAgentStatus = async (req, res) => {
  const agent = req.body;

  try {
    await Agent.update(
      {
        status: agent.status,
      },
      {
        where: {
          id: agent.id,
        },
      }
    );

    res.send({ success: true });
  } catch (error) {
    returnError(res, 400, "ERROR", error.message);
  }
};

module.exports = UpdateAgentStatus;
