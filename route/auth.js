const express = require("express");
const router = express.Router();
const { User } = require("../module");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

const { signAccessToken } = require("../helper/jwt_healper");

router.post("/register", async (req, res, next) => {
  try {
    const { userName, password, name, address, phoneNumber } = req.body;
    if (!userName || !password)
      throw createError.BadRequest("Email and password are require.");

    const doesExit = await User.findOne({ userName });
    if (doesExit) throw createError.Conflict(userName + " is already exit.");
    const user = new User({ userName, password, name, address, phoneNumber });
    const saveData = await user.save();
    if (!saveData) throw createError.BadRequest();
    const accessToken = await signAccessToken(saveData.id);
    res.send({ accessToken });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password)
      throw createError.BadRequest("Email and password are require.");
    const doExit = await User.findOne({ userName });
    if (!doExit) throw createError.NotFound("User not registered.");

    const isMatch = await bcrypt.compare(password, doExit.password);
    if (!isMatch)
      throw createError.Unauthorized("User and password does not match.");

    const accessToken = await signAccessToken(doExit.id);
    res.send({ accessToken });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
