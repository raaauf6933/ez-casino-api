const db = require("../../../models");
const { returnList } = require("../../common/returnResponse");
const { userTypes } = require("../../enum");
const Payout = db.payOutBatch;
const Club = db.club;
const User = db.users;

const GetPayoutList = async (req, res) => {
  const user = req.user;

  Payout.belongsTo(User, {
    foreignKey: "added_by",
  });

  Payout.belongsTo(Club, {
    foreignKey: "club_id",
  });

  try {
    if (user.usertype === userTypes.SUPER_USER) {
      const result = await Payout.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "club_id", "first_name", "last_name"],
          },
          {
            model: Club,
            attributes: ["id", "club_name"],
          },
        ],
      });
      const payouts = result.map((e) => e.toJSON());

      res.send(returnList(payouts));
    } else {
      const result = await Payout.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "club_id", "first_name", "last_name"],
          },
          {
            model: Club,
            attributes: ["id", "club_name"],
          },
        ],
        where: {
          club_id: user.club_id,
        },
      });
      const payouts = result.map((e) => e.toJSON()).reverse();

      res.send(returnList(payouts));
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = GetPayoutList;
