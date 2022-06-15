const db = require("../../../models");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Users = db.users;

const getAllUsers = async (_req, res) => {
  const result = await Users.findAll({});
  res.send(result);
};

const getUser = async (req, res) => {
  const user = req.query;

  try {
    const result = await Users.findByPk(user.id);

    if (result) {
      res
        .status(200)
        .send(
          _.pick(
            result,
            "id",
            "first_name",
            "last_name",
            "contact_number",
            "email",
            "username",
            "usertype",
            "status"
          )
        );
    } else {
      throw Error("User not found");
    }
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
  try {
    // insert data to database table
    const result = await Users.update(
      {
        ...user,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

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
  getUser,
  updateUser,
};
