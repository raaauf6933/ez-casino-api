const Express = require("express");
const router = Express.Router();
const Auth = require("../../middleware/auth");
const getAgents = require("./../../controller/Agent/get_agents");
const createAgent = require("./../../controller/Agent/create_agent");
const getAgent = require("./../../controller/Agent/get_agent");
const getAgentDashboard = require("../../controller/Dashboard/agent_dashboard/get_agent_dashboard");
const getAgentPermission = require("../../controller/Dashboard/agent_dashboard/permission");
const updateAgentStatus = require("../../controller/Agent/update_agent_status");
const {
  validateCreateAgent,
  validateExist,
} = require("../../middleware/Agent/validators");

router.get("/get_agents", Auth, getAgents);

router.get("/get_agent", Auth, getAgent);

router.get("/get_agent_dashboard", Auth, getAgentPermission, getAgentDashboard);

router.post(
  "/create_agent",
  Auth,
  validateCreateAgent,
  validateExist,
  createAgent
);

router.post("/update_agent_status", Auth, updateAgentStatus);

module.exports = router;
