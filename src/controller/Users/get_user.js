const db = require("../../../models");
const _ = require("lodash");
const Users = db.users;
const Club = db.club;

const getUser = async (req, res) => {
  const user = req.query;

  // associate
  Users.belongsTo(Club, {
    foreignKey: "club_id",
  });

  try {
    const result = await Users.findByPk(user.id, {
      include: Club,
    });

    if (result) {
      res
        .status(200)
        .send(
          _.pick(
            result,
            "id",
            "club_id",
            "first_name",
            "last_name",
            "contact_number",
            "email",
            "username",
            "usertype",
            "status",
            "Club"
          )
        );
    } else {
      throw Error("User not found");
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = getUser;
