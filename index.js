const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "*", // <-- location of the react app
    credentials: true,
    allowedHeaders: "*",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
