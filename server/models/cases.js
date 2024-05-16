const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  name: {
    type: "string",
    unique: true,
    required: true,
  },
  caseType: {
    type: "string",
    required: true,
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
    required: true,
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
