const Express = require("express");
const router = Express.Router();
const { login } = require("./../../controller/Authentication");
const verifyToken = require("./../../controller/Authentication/verify_token");

router.post("/login", login);

router.post("/verify_token", verifyToken);

module.exports = router;
