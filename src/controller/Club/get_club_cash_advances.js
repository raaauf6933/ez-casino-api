const { returnList } = require("../../common/returnResponse");
const db = require("./../../../models");
const ClubCashAdvances = db.clubCashAdvance;
const Club = db.club;

const GetClubCashAdvances = async (req, res) => {
  ClubCashAdvances.belongsTo(Club, {
    foreignKey: "club_id",
  });
  try {
    const result = await ClubCashAdvances.findAll({
      include: {
        model: Club,
        attributes: ["id", "club_game_id", "club_name"],
      },
    });

    res.send(returnList(result.reverse()));
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

module.exports = GetClubCashAdvances;
