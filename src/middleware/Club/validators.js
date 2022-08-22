const db = require("../../../models");
const Club = db.Club;
const Joi = require("joi");
const { statusType } = require("./../../enum");

exports.validateCreateClub = (req, res, next) => {
  const club = req.body;

  const schema = Joi.object({
    id: Joi.string().min(1).max(255),
    admin_rate: Joi.number().min(1).max(10),
    club_game_id: Joi.number().required(),
    club_name: Joi.string().min(3).max(255).required(),
    contact_person: Joi.string().min(3).max(255).required(),
    mobile_number: Joi.string().min(3).max(11).required(),
    email: Joi.string().min(3).max(255).email().required(),
    status: Joi.string()
      .valid(...Object.values(statusType))
      .required(),
  });

  const { error } = schema.validate(club);

  if (error) {
    res.status(400).send({ message: error.details[0].message });
  } else {
    next();
  }
};

exports.validateExist = async (req, res, next) => {
  const club = req.body;

  const resultClubName = await Club.findAll({
    attributes: ["club_name"],
    where: {
      club_name: club.club_name,
    },
  });

  if (resultClubName.length !== 0) {
    res.status(400).send({ message: "Club Name is already in use" });
  } else {
    next();
  }
};
