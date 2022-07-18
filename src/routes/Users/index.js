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
  ChangePassword,
  validatePassword,
} = require("./../../controller/Users/change_password");

const {
  validateCreateUser,
  validateUpdateUser,
  validateExist,
  validateChangePassword,
} = require("../../middleware/Users/validators");
const Auth = require("../../middleware/auth");

router.get("/get_users", Auth, getAllUsers);

router.get("/get_user", getUser);

router.post("/create_user", validateCreateUser, validateExist, createUser);

router.post("/edit_user", validateUpdateUser, updateUser);

router.get("/get_my_account_details", Auth, getMyAccountDetails);

router.post(
  "/change_password",
  Auth,
  validateChangePassword,
  validatePassword,
  ChangePassword
);

module.exports = router;
