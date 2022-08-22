const csv = require("csvtojson");
const validatePayoutHeaders = require("./../../helpers/validate_payout_headers");
const validateClubPayoutData = require("./validateClubPayoutData");
const { exceptions } = require("../../utils/exception");

const header = [
  "club_id", //Number
  "club_earn",
];

const ValidateClubPayout = async (req, res, next) => {
  try {
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

      const result = await validateClubPayoutData(json);
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

module.exports = ValidateClubPayout;
