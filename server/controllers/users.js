const User = require("../models/users");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/CustomError");

const createUser = async (req, res, next) => {
  try {
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
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const validateUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password ?? "";
    const userData = await User.findOne({ email });
    console.log("UserData", userData);
    const isPasswordValid = await userData.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(404).json({ msg: "Invalid password" });
    }
    return res.status(200).json({
      message: "Login Successfull",
      token: await userData.generateToken(),
      userId: userData._id.toString(),
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) {
      next(new CustomError("Token is required", 400));
    }
    const tokenData = jwt.verify(token, "ABCDEFGH");
    return res.status(200).json({ message: tokenData });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const upload = async (req, res, next) => {
  console.log(req.user);
  return res.status(200).json({ message: "File Uploaded Successfully" });
};

const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    console.log(page, "page");
    const pageSize = 10;
    const totalUsers = await User.countDocuments();
    const allUsers = await User.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select("-password");
    res.status(200).json({
      msg: "All users fetched successfully",
      dataCount: totalUsers,
      totalPages: Math.ceil(totalUsers / pageSize),
      currentPage: page,
      data: allUsers,
    });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    console.log("req,res", req, res);
    const id = req.params.id; // Extract the id from request parameters
    const userData = await User.findById(id).select("-password"); // Use findById to find user by ID
    res.status(200).json({
      message: "User fetched successfully",
      data: userData,
    });
  } catch (err) {
    next(err);
  }
};

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
