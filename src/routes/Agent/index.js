const Express = require("express");
const router = Express.Router();
const Auth = require("../../middleware/auth");
const getAgents = require("./../../controller/Agent/get_agents");
const createAgent = require("./../../controller/Agent/create_agent");
const getAgent = require("./../../controller/Agent/get_agent");
const {
  validateCreateAgent,
  validateExist,
} = require("../../middleware/Agent/validators");

router.get("/get_agents", Auth, getAgents);

router.get("/get_agent", Auth, getAgent);

router.post(
  "/create_agent",
  Auth,
  validateCreateAgent,
  validateExist,
  createAgent
);

module.exports = router;
