const jwt = require("jsonwebtoken");
const createError = require("http-errors");
// require("dotenv").config();
// const client = require("./int_helper");
const securet = "fhskjfhksjhfkdsjn,vmbfbjdskjfhdsj";
module.exports = {
  signAccessToken: (userid) => {
    return new Promise((resolve, reject) => {
      const paylode = {
        name: "Your trust.",
        iss: "Raj.com",
      };
      //   const securet = securet;
      const options = {
        audience: userid,
      };
      jwt.sign(paylode, securet, options, (err, token) => {
        if (err) return reject(err);
        resolve(token);
      });
    });
  },

  verifyToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, securet, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(createError.Unauthorized());
        } else {
          return next(createError.Unauthorized("You need to logIn"));
        }
      }
      req.payload = payload;
      next();
    });
  },
};
