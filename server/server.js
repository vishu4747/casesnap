const express = require("express");
const dbConnection = require("./utils/dbConnection");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const app = express();
const userRouter = require("./routes/users");
const errorMiddleware = require("./middleware/error-middleware");
const isAuthenticated = require("../server/middleware/auth-middleware");

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.json());

app.use("/api/users", userRouter);

app.use(errorMiddleware);
app.use(isAuthenticated);

const PORT = 3000;
dbConnection
  .then(() => {
    console.log("Connection established");
    app.listen(PORT, () => {
      console.log("listening on port " + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
