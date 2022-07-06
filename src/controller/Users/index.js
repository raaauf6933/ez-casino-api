const db = require("../../../models");
const bcrypt = require("bcrypt");
const { returnList } = require("../../common/returnResponse");
const _ = require("lodash");
const Users = db.users;
const Club = db.club;

const getAllUsers = async (_req, res) => {
  Users.belongsTo(Club, {
    foreignKey: "club_id",
  });

  try {
    const result = await Users.findAll({
      include: Club,
    });

    const filterResult = result
      ? result.map((e) => _.omit(e.toJSON(), ["password"]))
      : [];

    res.send(returnList(filterResult));
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const createUser = async (req, res) => {
  const user = req.body;
  try {
    // encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // insert data to database table
    const result = await Users.create({
      ...user,
    });

    res.status(200).send(result);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const user = req.body;

  const updatedUser = {
    ...user,
    club_id: user.usertype === "SUPER_USER" ? null : user.club_id,
  };

  try {
    // insert data to database table
    const result = await Users.update(updatedUser, {
      where: {
        id: user.id,
      },
    });

    if (result[0] !== 0) {
      res.status(200).send({ message: "Changes saved!" });
    } else {
      throw Error("User not found");
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
};
