const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  name: {
    type: "string",
    unique: [true, "Case name must be unique"],
    required: [true, "Case name must be provided"],
  },
  caseType: {
    type: "string",
    required: [true, "Case type must be provided"],
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  status: {
    type: "string",
    enum: ["pending", "in_progress", "complete"],
    default: "pending",
  },
  startDate: {
    type: Date,
  },
  fees: {
    type: "number",
    required: [true, "fees must be provided"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;
