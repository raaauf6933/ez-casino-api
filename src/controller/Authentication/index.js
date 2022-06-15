const db = require("../../../models");
const bcrypt = require("bcrypt");
const Users = db.users;
const { generateAuthToken } = require("./../../utils/generateToken");

const login = async (req, res) => {
  const user = req.body;

  try {
    const result = await Users.findOne({ where: { username: user.username } });

    // return if username is not exist
    if (!result)
      return res
        .status(400)
        .send({ status: "failed", message: "Invalid email or password." });

    // compare password if valid
    const validPassword = await bcrypt.compare(user.password, result.password);

    if (!validPassword)
      return res
        .status(400)
        .send({ status: "failed", message: "Invalid email or password." });

    const token = generateAuthToken({
      _id: result.id,
      username: result.username,
      first_name: result.first_name,
      last_name: result.last_name,
    });

    res.status(200).send({
      token,
    });
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = {
  login,
};
