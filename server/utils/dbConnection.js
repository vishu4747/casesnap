const mongoose = require("mongoose");

const URL = "mongodb://0.0.0.0:27017";
const dbConnection = mongoose.connect(URL, {
  dbName: "codesnapdb",
});

module.exports = dbConnection;
