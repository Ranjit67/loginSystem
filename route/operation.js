const express = require("express");
const router = express.Router();
const { User } = require("../module");
const createError = require("http-errors");
const { verifyToken } = require("../helper/jwt_healper");

router.put("/profileUpdate", verifyToken, async (req, res, next) => {
  try {
    const { name, address, phoneNumber } = req.body;

    const { aud } = req.payload;
    const userExit = await User.findById(aud);
    if (!userExit) throw createError.Conflict("The user is not found.");
    const update = await User.findOneAndUpdate(
      { _id: aud },
      {
        name: name || userExit.name,
        address: address || userExit.address,
        phoneNumber: phoneNumber || userExit.phoneNumber,
      }
    );
    if (!update) throw createError.InternalServerError("Something want wrong.");
    res.json({ data: "Data update success." });
  } catch (error) {
    next(error);
  }
});
router.delete("/deleteUser", verifyToken, async (req, res, next) => {
  try {
    const { aud } = req.payload;
    const deleteUser = await User.findByIdAndDelete(aud);
    if (deleteUser)
      throw createError.InternalServerError("Something want wrong.");
    res.json({ data: "User delete successfully." });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
