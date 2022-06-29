const Express = require("express");
const router = Express.Router();
const {
  getClubs,
  getClub,
  createClub,
  updateClub,
} = require("./../../controller/Club");
const {
  validateCreateClub,
  validateExist,
} = require("../../middleware/Club/validators");

router.get("/get_clubs", getClubs);

router.get("/get_club", getClub);

router.post("/create_club", validateCreateClub, validateExist, createClub);

router.post("/update_club", validateCreateClub, updateClub);

module.exports = router;
