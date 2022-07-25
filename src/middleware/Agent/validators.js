const db = require("../../../models");
const Agent = db.agent;
const User = db.users;
const Joi = require("joi");
const { statusType } = require("./../../enum");

exports.validateCreateAgent = (req, res, next) => {
  const agent = req.body;

  const schema = Joi.object({
    game_code: Joi.string().min(1).max(255).required(),
    first_name: Joi.string().min(1).max(255).allow(null, ""),
    last_name: Joi.string().min(1).max(255).allow(null, ""),
    comms_rate: Joi.number().min(50).max(100).required(),
    username: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(3).max(255).email().allow(null, ""),
    contact_number: Joi.string().min(11).max(11).allow(null, ""),
    status: Joi.string()
      .valid(...Object.values(statusType))
      .required(),
  });

  const { error } = schema.validate(agent);

  if (error) {
    res.status(400).send({ message: error.details[0].message });
  } else {
    next();
  }
};

exports.validateExist = async (req, res, next) => {
  const agent = req.body;

  const resultGameCode = await Agent.findAll({
    attributes: ["game_code"],
    where: {
      game_code: agent.game_code,
    },
  });

  const resultUsername = await Agent.findAll({
    attributes: ["username"],
    where: {
      username: agent.username,
    },
  });

  const resultUserUsername = await User.findAll({
    attributes: ["username"],
    where: {
      username: agent.username,
    },
  });

  if (resultGameCode.length !== 0) {
    res.status(400).send({ message: "Game Code is already in use" });
  } else if (resultUsername.length !== 0 || resultUserUsername.length !== 0) {
    res.status(400).send({ message: "Username is already in use" });
  } else {
    next();
  }
};
