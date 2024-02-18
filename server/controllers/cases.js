const Case = require("../models/cases");
const CustomError = require("../utils/CustomError");

const createCase = async (req, res, next) => {
  try {
    const { name, caseType, startDate, fees } = req.body;
    const createdBy = req.user._id;
    console.log(createdBy);
    if (!name || !caseType || !startDate || !fees) {
      next(new CustomError("Plase provide all data", 401));
    }
    const caseData = await Case.create({
      name,
      caseType,
      startDate,
      fees,
      createdBy,
    });
    return res
      .status(201)
      .json({ message: "Case created successfully", data: caseData });
  } catch (err) {
    next(err);
  }
};

const getMyCases = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const Cases = await Case.find({ createdBy: userId }).populate(
      "createdBy",
      "name"
    );
    res
      .status(200)
      .json({ message: "Case found", count: Cases.length, data: Cases });
  } catch (err) {
    next(err);
  }
};

const updateCase = async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const updatedDocument = await Case.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ message: "Case updated successfully", data: updatedDocument });
  } catch (err) {
    next(err);
  }
};

const updateCaseStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const caseData = await Case.findOne({ _id: id }).select("status");
    if (caseData.status == "complete")
      next(new CustomError("Case is already completed", 400));
    const updatedDocument = await Case.findByIdAndUpdate(
      id,
      {
        status:
          caseData.status == "pending"
            ? "in_progress"
            : caseData.status == "in_progress"
            ? "complete"
            : "complete",
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "case updated successfully", data: updatedDocument });
  } catch (err) {
    next(err);
  }
};

module.exports = { createCase, getMyCases, updateCase, updateCaseStatus };
