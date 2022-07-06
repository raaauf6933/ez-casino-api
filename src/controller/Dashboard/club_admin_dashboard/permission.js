const { api_reponse } = require("../../../common/messages");
const { returnError } = require("../../../common/returnResponse");

const GetClubAdminermission = async (req, res, next) => {
  const agent = req.user;

  try {
    if (agent.usertype !== "CLUB_ADMIN") {
      throw Error(api_reponse.NO_PERMISSION);
    }

    next();
  } catch (error) {
    returnError(res, 404, "PERMISSION", error.message);
  }
};

module.exports = GetClubAdminermission;
