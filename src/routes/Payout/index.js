const Express = require("express");
const router = Express.Router();
const Auth = require("./../../middleware/auth");
const uploadCsv = require("./../../middleware/FileHandler/uploadCsv");
const validatePayout = require("./../../middleware/Payout/validatePayout");
const createBatchPayout = require("../../controller/Payout/create_batch_payout");
const get_payout_list = require("../../controller/Payout/get_payout_list");
const getPayoutDetails = require("../../controller/Payout/get_payout_details");

router.get("/get_payout_list", Auth, get_payout_list);
router.get("/get_payout_details", Auth, getPayoutDetails);

router.post(
  "/upload_agent_batch",
  Auth,
  uploadCsv,
  validatePayout,
  createBatchPayout
);

module.exports = router;
