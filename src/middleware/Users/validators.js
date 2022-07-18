const db = require("../../../models");
const Users = db.users;
const Agent = db.agent;
const Joi = require("joi");
const { statusType, userTypes } = require("./../../enum");

exports.validateCreateUser = (req, res, next) => {
  const user = req.body;

  const schema = Joi.object({
    club_id: Joi.number().allow(null),
    first_name: Joi.string().min(3).max(255).required(),
    last_name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
    contact_number: Joi.string().min(11).max(11).required(),
    status: Joi.string()
      .valid(...Object.values(statusType))
      .required(),
    usertype: Joi.string()
      .valid(...Object.values(userTypes))
      .required(),
    username: Joi.string().min(6).max(16).required(),
    password: Joi.string().min(6).max(16).required(),
    confirm_password: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "confirm_password must match password" }),
  });

  const { error } = schema.validate(user);

  if (error) {
    res.status(400).send({ message: error.details[0].message });
  } else {
    next();
  }
};

exports.validateUpdateUser = (req, res, next) => {
  const user = req.body;

  const schema = Joi.object({
    id: Joi.string().required(),
    club_id: Joi.number().min(1).max(32),
    first_name: Joi.string().min(3).max(255).required(),
    last_name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
    contact_number: Joi.string().min(11).max(11).required(),
    usertype: Joi.string()
      .valid(...Object.values(userTypes))
      .required(),
    status: Joi.string()
      .valid(...Object.values(statusType))
      .required(),
  });

  const { error } = schema.validate(user);

  if (error) {
    res.status(400).send({ message: error.details[0].message });
  } else {
    next();
  }
};

exports.validateExist = async (req, res, next) => {
  const user = req.body;

  const resultUsername = await Users.findAll({
    attributes: ["username"],
    where: {
      username: user.username,
    },
  });

  const resultAgentUsername = await Agent.findAll({
    attributes: ["username"],
    where: {
      username: user.username,
    },
  });

  const resultEmail = await Users.findAll({
    attributes: ["email"],
    where: {
      email: user.email,
    },
  });

  if (resultUsername.length !== 0 || resultAgentUsername.length !== 0) {
    res.status(400).send({ message: "Username is already in use" });
  } else if (resultEmail.length !== 0) {
    res.status(400).send({ message: "Email is already in use" });
  } else {
    next();
  }
};

exports.validateChangePassword = (req, res, next) => {
  const user = req.body;

  const schema = Joi.object({
    newPassword: Joi.string().min(6).max(255).required(),
    oldPassword: Joi.string().min(1).max(255).required(),
  });

  const { error } = schema.validate(user);

  if (error) {
    res.status(400).send({ message: error.details[0].message });
  } else {
    next();
  }
};
