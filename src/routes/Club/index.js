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
const Auth = require("../../middleware/auth");
const GetClubAdminDashboard = require("../../controller/Dashboard/club_admin_dashboard/get_club_agent_dashboard");
const { userTypes } = require("../../enum");
const GetClubTransactions = require("../../controller/Club/get_club_transactions");
const GetClubSettlement = require("../../controller/Club/get_club_settlement");

router.get("/get_clubs", getClubs);

router.get("/get_club", getClub);

router.get(
  "/get_club_admin_dashboard",
  function (req, _res, next) {
    req.usertypes = [userTypes.CLUB_ADMIN];
    next();
  },
  Auth,
  GetClubAdminDashboard
);

router.post("/create_club", validateCreateClub, validateExist, createClub);

router.post("/update_club", validateCreateClub, updateClub);

router.get("/get_club_transactions", Auth, GetClubTransactions);

router.get(
  "/get_club_settlement",
  function (req, _res, next) {
    req.usertypes = [userTypes.CLUB_ADMIN, userTypes.SUPER_USER];
    next();
  },
  Auth,
  GetClubSettlement
);

module.exports = router;
