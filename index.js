const express = require("express");
const cors = require("cors");
const app = express();
const timeout = require("connect-timeout"); //express v4

global.__basedir = __dirname;

app.use(
  cors({
    origin: "*", // <-- location of the react app
    credentials: true,
    allowedHeaders: "*",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(timeout(180000));

app.get("/", (_req, res) => {
  res.send({
    status: "success",
  });
});

// startups
require("./startup/cloudStorage")();

app.use("/dashboard", require("./src/routes/Dashboard"));
app.use("/users", require("./src/routes/Users"));
app.use("/auth", require("./src/routes/Authentication"));
app.use("/club", require("./src/routes/Club"));
app.use("/agent", require("./src/routes/Agent"));
app.use("/payout", require("./src/routes/Payout"));
app.use("/club_payout", require("./src/routes/ClubPayout"));

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});

server.setTimeout(500000);
