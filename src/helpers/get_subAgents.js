const db = require("../../models");
const Agent = db.agent;

const GetSubAgents = async (id) => {
  try {
    const result = await Agent.findAll({
      attributes: [
        "id",
        "game_code",
        "first_name",
        "last_name",
        "username",
        "email",
        "contact_number",
        "status",
      ],
      where: {
        added_by_id: id,
        added_by_usertype: "AGENT",
      },
    });

    return {
      subAgents: result,
      total_count: result.length,
    };
  } catch (error) {
    return { error };
  }
};

module.exports = GetSubAgents;
