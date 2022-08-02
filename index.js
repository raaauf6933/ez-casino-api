const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "https://ezcasinoph.club", // <-- location of the react app
    credentials: true,
    allowedHeaders: "*",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "https://ezcasinoph.club");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.get("/", (_req, res) => {
  res.send({
    status: "success",
  });
});

app.use("/dashboard", require("./src/routes/Dashboard"));
app.use("/users", require("./src/routes/Users"));
app.use("/auth", require("./src/routes/Authentication"));
app.use("/club", require("./src/routes/Club"));
app.use("/agent", require("./src/routes/Agent"));
app.use("/payout", require("./src/routes/Payout"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
