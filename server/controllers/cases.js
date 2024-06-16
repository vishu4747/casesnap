const { asyncError } = require("../middleware/error-middleware");
const Case = require("../models/cases");
const User = require("../models/users");
const CustomError = require("../utils/CustomError");

const createCase = asyncError(async (req, res, next) => {
  const { name, caseType, startDate, fees, description } = req.body;
  const createdBy = req.user._id;
  if (!name || !caseType || !startDate || !fees || !description) {
    next(new CustomError("Plase provide all data", 401));
  }
  const caseData = await Case.create({
    name,
    caseType,
    startDate,
    fees,
    description,
    createdBy,
  });
  return res
    .status(201)
    .json({ message: "Case created successfully", data: caseData });
});

const getMyCases = asyncError(async (req, res, next) => {
  const userId = req.user._id;
  const Cases = await Case.find({ assignedTo: userId })
    .populate("createdBy", "name")
    .populate("assignedTo", "name")
    .select("-fees -__v");
  res
    .status(200)
    .json({ message: "Case found", count: Cases.length, data: Cases });
});

const getCase = asyncError(async (req, res, next) => {
  const id = req.params.id; // Extract the id from request parameters
  const Cases = await Case.findById(id); // Use findById to find user by ID
  res.status(200).json({
    message: "case fetched successfully",
    data: Cases,
  });
});

const updateCase = asyncError(async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  // Update the document and wait for the result
  const updatedDocument = await Case.findByIdAndUpdate(id, body, {
    new: true,
  });

  // If no document is found with the provided id, handle the case
  if (!updatedDocument) {
    return res.status(404).json({ message: "Case not found" });
  }

  // Send a response with the updated document
  res
    .status(200)
    .json({ message: "Case updated successfully", data: updatedDocument });
});

const updateCaseStatus = asyncError(async (req, res, next) => {
  const id = req.params.id;
  const user_id = req.user._id;
  const caseData = await Case.findOne({ _id: id }).select("status assignedTo");
  if (caseData.assignedTo.toString() !== user_id.toString())
    next(new CustomError("Not authorized to perform this action", 401));
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
});

const getAllCases = asyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const skip = parseInt(req.query.skip) || 0;
  const dataCount = await Case.countDocuments();
  const allCases = await Case.find()
    .skip(skip)
    .limit(pageSize)
    .populate("createdBy", "name")
    .populate("assignedTo", "name");
  res.status(200).json({
    message: "All Cases",
    dataCount,
    data: allCases,
  });
});

const assignCase = asyncError(async (req, res, next) => {
  const { user_id, case_id } = req.body;
  const userData = await User.findOne({ _id: user_id }).select("role");
  if (userData.length < 1)
    next(new CustomError("Didn't find any user with user_id", 400));
  if (userData.role === "admin")
    next(new CustomError("Cannot assign case to admin", 400));
  const caseData = await Case.findOne({ _id: case_id }).select("assignedTo");
  if (caseData.length < 1)
    next(new CustomError("Didn't find any case with case_id", 400));
  const caseAssignedTo = caseData.assignedTo ?? "";
  if (caseAssignedTo !== "")
    next(new CustomError("Case is already assigened to another user", 400));
  const updatedCase = await Case.findByIdAndUpdate(
    case_id,
    {
      assignedTo: user_id,
    },
    { new: true }
  );
  res
    .status(200)
    .json({ message: "case assigned successfully", data: updatedCase });
});

module.exports = {
  createCase,
  getMyCases,
  updateCase,
  updateCaseStatus,
  getAllCases,
  getCase,
  assignCase,
};
