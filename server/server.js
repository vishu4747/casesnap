const express = require("express");
const dotenv = require("dotenv");
const dbConnection = require("./utils/dbConnection");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const app = express();
const userRouter = require("./routes/users");
const caseRouter = require("./routes/cases");
const { errorMiddleware } = require("./middleware/error-middleware");
const isAuthenticated = require("./middleware/auth-middleware");
const removeKeysMiddleware = require("./middleware/update-middleware");
const isAuthorized = require("./middleware/authorized-middleware");
const cors = require("cors");
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
app.use(cors());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.json());

app.use("/rahul", (req, res, next) => {
  const msg = req.query.msg;
  console.log("jj", req.query);
  console.log("msg", msg);
  res.status(200).json({
    msg: "data received",
  });
});

// routes
app.use("/api/users", userRouter);
app.use("/api/case", caseRouter);

app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.status = 404;
  next(error);
});

// middlewares
app.use(errorMiddleware);
app.use(isAuthenticated);
app.use(removeKeysMiddleware);
app.use(isAuthorized);

const PORT = 3000;
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
