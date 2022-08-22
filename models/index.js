"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js");

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

sequelize
  .authenticate()
  .then(function (err) {
    console.log("Connection has been established successfully.");
  })
  .catch(function (err) {
    console.log("Unable to connect to the database:", err);
  });

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users = require("./users")(sequelize, Sequelize.DataTypes);
db.club = require("./club")(sequelize, Sequelize.DataTypes);
db.agent = require("./agent")(sequelize, Sequelize.DataTypes);
db.payOutBatch = require("./payout_batch")(sequelize, Sequelize.DataTypes);
db.agentPayout = require("./agent_payout")(sequelize, Sequelize.DataTypes);
db.agentSubAgentPayout = require("./agent_subagent_payout")(
  sequelize,
  Sequelize.DataTypes
);
db.clubPayoutBatches = require("./club_payout_batches")(
  sequelize,
  Sequelize.DataTypes
);
db.clubPayouts = require("./club_payouts")(sequelize, Sequelize.DataTypes);

db.sequelize.sync({ force: false });

module.exports = db;
