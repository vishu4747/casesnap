const mongoose = require("mongoose");

const dbConnection = mongoose.connect(URL, {
  dbName: "codesanpdb",
});

module.exports = dbConnection;
