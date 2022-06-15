const Express = require("express");
const router = Express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  getUser,
} = require("./../../controller/Users");
const {
  validateCreateUser,
  validateUpdateUser,
  validateExist,
} = require("../../middleware/Users/validators");

router.get("/get_users", getAllUsers);

router.get("/get_user", getUser);

router.post("/create_user", validateCreateUser, validateExist, createUser);

router.post("/edit_user", validateUpdateUser, updateUser);

module.exports = router;
