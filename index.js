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

app.use("/users", require("./src/routes/Users"));
app.use("/auth", require("./src/routes/Authentication"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
