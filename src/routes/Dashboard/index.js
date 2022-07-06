const Express = require("express");
const router = Express.Router();

const Auth = require("../../middleware/auth");
const GetSuperAdminDashboard = require("../../controller/Dashboard/get_super_admin_dashboard");
const { userTypes } = require("../../enum");

router.get(
  "/get_super_user_dashboard",
  function (req, _res, next) {
    req.usertypes = [userTypes.SUPER_USER];
    next();
  },
  Auth,
  GetSuperAdminDashboard
);

module.exports = router;
