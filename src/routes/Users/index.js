const Express = require("express");
const router = Express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
} = require("./../../controller/Users");
const getUser = require("./../../controller/Users/get_user");
const getMyAccountDetails = require("./../../controller/Users/get_my_account_details");
const {
  validateCreateUser,
  validateUpdateUser,
  validateExist,
} = require("../../middleware/Users/validators");
const Auth = require("../../middleware/auth");

router.get("/get_users", Auth, getAllUsers);

router.get("/get_user", getUser);

router.post("/create_user", validateCreateUser, validateExist, createUser);

router.post("/edit_user", validateUpdateUser, updateUser);

router.get("/get_my_account_details", Auth, getMyAccountDetails);

module.exports = router;
