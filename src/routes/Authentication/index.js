const Express = require("express");
const router = Express.Router();
const { login } = require("./../../controller/Authentication");

router.post("/login", login);

module.exports = router;
