const db = require("../../models");
const Agent = db.agent;

const ValidateAgentId = async (id) => {
  try {
    const result = await Agent.findOne({
      where: {
        id,
      },
    });

    if (!result) {
      throw Error("ID not found");
    }
  } catch (error) {
    return error;
  }
};

module.exports = ValidateAgentId;
