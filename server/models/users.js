const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: [true, "Name must be provided"],
  },
  username: {
    type: "string",
    required: [true, "Username must be provided"],
  },
  email: {
    type: "string",
    unique: [true, "Email must be unique"],
    required: [true, "Email must be provided"],
  },
  phone_no: {
    type: "number",
    required: [true, "Phone no must be provided"],
  },
  password: {
    type: "string",
    required: [true, "Password must be provided"],
  },
  role: {
    type: "string",
    enum: ["user", "admin"],
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
      "ABCDEFGH",
      {
        expiresIn: "2h", //expiring the token
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
