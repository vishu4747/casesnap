const User = require("../models/users");
const Case = require("../models/cases");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/CustomError");
const { asyncError } = require("../middleware/error-middleware");

const createUser = asyncError(async (req, res, next) => {
  const { name, username, password, email, phone_no } = req.body;
  const userData = await User.create({
    name: name,
    username: username,
    email: email,
    phone_no: phone_no,
    password: password,
  });
  return res
    .status(200)
    .json({ message: userData, token: await userData.generateToken() });
});

const validateUser = asyncError(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password ?? "";
  const userData = await User.findOne({ email });
  const isPasswordValid = await userData.validatePassword(password);
  if (!isPasswordValid) {
    return res.status(404).json({ msg: "Invalid password" });
  }
  return res.status(200).json({
    message: "Login Successfully",
    token: await userData.generateToken(),
    userId: userData._id.toString(),
  });
});

const verifyToken = asyncError(async (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    next(new CustomError("Token is required", 400));
  }
  const tokenData = jwt.verify(token, "ABCDEFGH");
  return res.status(200).json({ message: tokenData });
});

const upload = asyncError(async (req, res, next) => {
  return res.status(200).json({ message: "File Uploaded Successfully" });
});

const getAllUsers = asyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;

  // Get total users count
  const totalUsers = await User.countDocuments();

  // Fetch users data
  const allUsers = await User.find()
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .select("-password");

  // Get count of cases for each status for each user
  const casesCountByStatusPerUser = await Case.aggregate([
    {
      $group: {
        _id: {
          assignedTo: "$assignedTo",
          status: "$status",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.assignedTo",
        casesCountByStatus: {
          $push: {
            status: "$_id.status",
            count: "$count",
          },
        },
      },
    },
  ]);

  // Map cases count to users
  const usersWithCasesCount = allUsers.map((user) => {
    const casesCount = casesCountByStatusPerUser.find((count) => {
      return count._id !== null ? count._id.equals(user._id) : false;
    }
    ) || { casesCountByStatus: [] };

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Add any other user fields you need
      casesCountByStatus: casesCount.casesCountByStatus,
    };
  });

  res.status(200).json({
    message: "All users fetched successfully",
    dataCount: totalUsers,
    totalPages: Math.ceil(totalUsers / pageSize),
    currentPage: page,
    data: usersWithCasesCount,
  });
});

const getUser = asyncError(async (req, res, next) => {
  const id = req.params.id; // Extract the id from request parameters
  const userData = await User.findById(id).select("-password"); // Use findById to find user by ID
  res.status(200).json({
    message: "User fetched successfully",
    data: userData,
  });
});

const rahul = async (req, res, next) => {
  try {
    console.log("rahul winnnn");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  validateUser,
  verifyToken,
  upload,
  getAllUsers,
  getUser,
  rahul,
};
// module.exports = { createUser, validateUser, verifyToken, upload, getAllUsers, getUser };
