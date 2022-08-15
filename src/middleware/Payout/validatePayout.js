// const db = require("./../../../models");
const csv = require("csvtojson");
const { userTypes } = require("../../enum");
const { api_reponse } = require("../../common/messages");
const validatePayoutHeaders = require("./../../helpers/validate_payout_headers");
const validatePayoutData = require("./../../helpers/validate_payout_data");
const { exceptions } = require("../../utils/exception");
// const Agents = db.agent;

const header = [
  "game_id", //Number
  "commission",
  "deduction",
  "admin_rate",
];

//Error handler

const ValidatePayout = async (req, res, next) => {
  const user = req.user;

  try {
    if (user.usertype !== userTypes.CLUB_ADMIN) {
      throw Error(api_reponse.NO_PERMISSION);
    }

    if (req.file) {
      const json = await csv().fromFile(req.file.path);

      const valideHeaderResult = validatePayoutHeaders(json, header);
      if (!valideHeaderResult.success) {
        throw new exceptions(
          false,
          valideHeaderResult.code,
          valideHeaderResult.error,
          valideHeaderResult.message
        );
      }

      const result = await validatePayoutData(json, user);

      if (!result.success) {
        throw new exceptions(false, result.code, result.error, result.message);
      }

      req.body = {
        payouts: json,
      };

      next();
    } else {
      throw Error("No file found");
    }
  } catch (error) {
    if (error instanceof exceptions) {
      return res.status(400).send({
        code: error.code,
        error: error.error,
        message: error.message,
      });
    } else {
      return res.status(400).send({
        error: error.message,
      });
    }
  }
};

module.exports = ValidatePayout;
