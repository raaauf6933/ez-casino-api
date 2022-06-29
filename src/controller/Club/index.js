const db = require("../../../models");
const _ = require("lodash");
const Club = db.Club;

const getClubs = async (req, res) => {
  const club = req.query;

  const getParams = () => {
    if (club.status) {
      return {
        where: {
          status: club.status,
        },
      };
    } else {
      return {};
    }
  };

  try {
    const result = await Club.findAll(getParams());
    res.status(200).send(result);
  } catch (error) {
    res.status(404).send({
      message: error.message,
    });
  }
};

const getClub = async (req, res) => {
  const club = req.query;

  try {
    const result = await Club.findByPk(club.id);

    if (result) {
      res
        .status(200)
        .send(
          _.pick(
            result,
            "id",
            "club_name",
            "contact_person",
            "mobile_number",
            "email",
            "status"
          )
        );
    } else {
      throw Error("Club not found");
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const createClub = async (req, res) => {
  const club = req.body;

  try {
    const result = await Club.create({
      ...club,
    });

    res.status(200).send(result);
  } catch (error) {
    res.status(404).send({
      message: error.message,
    });
  }
};

const updateClub = async (req, res) => {
  const club = req.body;

  try {
    // insert data to database table
    const result = await Club.update(
      {
        ...club,
      },
      {
        where: {
          id: club.id,
        },
      }
    );

    if (result[0] !== 0) {
      res.status(200).send({ message: "Changes saved!" });
    } else {
      throw Error("Club not found");
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

module.exports = {
  getClubs,
  createClub,
  getClub,
  updateClub,
};
