const db = require("./../../../models");
const { payout_error_code } = require("./../../common/messages");
const { exceptions } = require("./../../utils/exception");
const Club = db.club;

const checkIfClubExist = async (club_game_id) => {
  const result = await Club.findOne({
    attributes: ["id"],
    where: {
      club_game_id,
    },
  });

  return result;
};

// eslint-disable-next-line no-unused-vars
let duplicate;
const checkIfDuplicate = (data) => {
  const arrayData = data.map((e) => e.club_id);
  arrayData.some(function (item, idx) {
    if (arrayData.indexOf(item) != idx) {
      duplicate = new exceptions(
        false,
        payout_error_code.DUPLICATE,
        `Duplicates of ID is not allowed`,
        `Club ID ${item}`
      );
    } else {
      duplicate = null;
    }

    return arrayData.indexOf(item) != idx;
  });
};

const ValidatePayoutData = async (json) => {
  // validate Duplicates

  checkIfDuplicate(json);
  if (duplicate) {
    return duplicate;
  }
  // Validate payout data

  for await (const data of json) {
    const { club_id, club_earn } = data;
    const message = new Object();
    message.club_game_id = club_id;

    if (!club_id) {
      message.error = "Club ID should not be blank";
    }

    const result = await checkIfClubExist(club_id);

    if (!result) {
      message.error = "Club ID not found";
    }

    if (isNaN(club_earn) || !club_earn) {
      message.error = "Club Earn should not be empty and must be a number";
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
