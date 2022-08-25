const Express = require("express");
const router = Express.Router();
const Auth = require("../../middleware/auth");
const uploadCsv = require("./../../middleware/FileHandler/uploadCsv");
const ValidateClubPayout = require("./../../controller/ClubPayout/validateClubPayout");
const CreateClubPayout = require("./../../controller/ClubPayout/create_club_payout");
const GetClubPayoutBatches = require("./../../controller/ClubPayout/get_club_payout_batches");
const GetClubPayoutDetails = require("./../../controller/ClubPayout/get_club_payout_details");
const { userTypes } = require("../../enum");
const UpdateClubBatchPayout = require("../../controller/ClubPayout/update_club_batch_payout");

router.get(
  "/get_club_payout_batches",
  function (req, _res, next) {
    req.usertypes = [userTypes.SUPER_USER];
    next();
  },
  Auth,
  GetClubPayoutBatches
);

router.post(
  "/upload_club_payout",
  function (req, _res, next) {
    req.usertypes = [userTypes.SUPER_USER];
    next();
  },
  Auth,
  uploadCsv,
  ValidateClubPayout,
  CreateClubPayout
);

router.get("/get_club_payout_details", Auth, GetClubPayoutDetails);

router.post(
  "/update_club_batch_payout",
  function (req, _res, next) {
    req.usertypes = [userTypes.SUPER_USER];
    next();
  },
  Auth,
  UpdateClubBatchPayout
);

module.exports = router;
