const express = require("express");
const dotenv = require("dotenv");
const dbConnection = require("./utils/dbConnection");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const app = express();
const userRouter = require("./routes/users");
const caseRouter = require("./routes/cases");
const errorMiddleware = require("./middleware/error-middleware");
const isAuthenticated = require("./middleware/auth-middleware");
const removeKeysMiddleware = require("./middleware/update-middleware");
const isAuthorized = require("./middleware/authorized-middleware");

//config
dotenv.config({
  path: "./config/config.env",
});

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.json());

//routes
app.use("/api/users", userRouter);
app.use("/api/case", caseRouter);

//middlewares
app.use(errorMiddleware);
app.use(isAuthenticated);
app.use(removeKeysMiddleware);
app.use(isAuthorized);

// const PORT = 3000;
dbConnection
  .then(() => {
    console.log("Connection established");
    app.listen(process.env.PORT, () => {
      console.log("listening on port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
