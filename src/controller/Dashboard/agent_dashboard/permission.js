const { api_reponse } = require("../../../common/messages");
const { returnError } = require("../../../common/returnResponse");

const GetAgentPermission = async (req, res, next) => {
  const agent = req.user;

  try {
    if (agent.usertype !== "AGENT") {
      throw Error(api_reponse.NO_PERMISSION);
    }

    next();
  } catch (error) {
    returnError(res, 404, "PERMISSION", error.message);
  }
};

module.exports = GetAgentPermission;
