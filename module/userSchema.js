const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: { type: String },
  userName: { type: String },
  password: { type: String },
  address: { type: String },
  phoneNumber: { type: String },
  timestamp: { type: Date, default: Date.now },
  lastLoginTime: { type: String },
});

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("user", userSchema);
