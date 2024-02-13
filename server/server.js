const express = require("express");
const dbConnection = require("./utils/dbConnection");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const app = express();

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.json());

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
