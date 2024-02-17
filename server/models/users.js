const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  username: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    unique: true,
    required: true,
  },
  phone_no: {
    type: "number",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
  role: {
    type: "string",
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  } else {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
  }
});

userSchema.methods.validatePassword = async function (password) {
  try {
    console.log(password);
    return bcrypt.compareSync(password, this.password);
  } catch (err) {
    console.log(err);
  }
};

userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        username: this.username,
        email: this.email,
      },
      "ABCDEFGH"
    );
  } catch (err) {
    console.log(err);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
