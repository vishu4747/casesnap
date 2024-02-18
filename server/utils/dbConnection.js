const mongoose = require("mongoose");

const URL = "mongodb://localhost:27017";
const dbConnection = mongoose.connect(URL, {
  dbName: "codesnapdb",
});

module.exports = dbConnection;
