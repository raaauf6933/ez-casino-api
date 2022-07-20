const db = require("./../../models");
const { payout_error_code } = require("./../common/messages");
const { exceptions } = require("./../utils/exception");
const Agents = db.agent;

const checkIfAgentExist = async (game_id, user) => {
  const result = await Agents.findOne({
    attributes: ["id"],
    where: {
      game_code: game_id,
      club_id: user.club_id,
    },
  });

  return result;
};

// eslint-disable-next-line no-unused-vars
let duplicate;
const checkIfDuplicate = (data) => {
  const arrayData = data.map((e) => e.game_id);
  arrayData.some(function (item, idx) {
    if (arrayData.indexOf(item) != idx) {
      duplicate = new exceptions(
        false,
        payout_error_code.DUPLICATE,
        `Duplicates of ID is not allowed`,
        `Game ID ${item}`
      );
    } else {
      duplicate = null;
    }

    return arrayData.indexOf(item) != idx;
  });
};

const ValidatePayoutData = async (json, user) => {
  // validate Duplicates

  checkIfDuplicate(json);
  if (duplicate) {
    return duplicate;
  }
  // Validate payout data

  for await (const data of json) {
    const { game_id, commission, deduction } = data;
    const message = new Object();
    message.game_id = game_id;

    if (!game_id) {
      message.error = "Game ID should not be blank";
    }

    const result = await checkIfAgentExist(game_id, user);

    if (!result) {
      message.error = "Game ID not found";
    }

    if (isNaN(commission) || !commission) {
      message.error = "Initial Salary should not be empty and must be a number";
    }

    if (isNaN(commission) || !commission) {
      message.error = "Initial Salary should not be empty and must be a number";
    }

    if (isNaN(deduction) || !deduction) {
      message.error = "Deduction should not be empty and must be a number";
    }

    if (Object.keys(message).length > 1) {
      return new exceptions(
        false,
        payout_error_code.DATA_FORMAT,
        "Please fill the correct formats",
        message
      );
    }
  }
  return { success: true };
};

module.exports = ValidatePayoutData;
