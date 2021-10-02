const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const createError = require("http-errors");
const { auth, operation } = require("./route");
const app = express();
// ===============**********middleware***********============
app.use(morgan("dev"));
app.use(express.json());
// ============*********Http Request header permission allow*********=================
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }

  next();
});

// =======**********Database connection******==============
mongoose.connect(
  "mongodb+srv://ranjit_7:jW9GyIvTsq8OOztF@cluster0.y5crp.mongodb.net/taskProjectDB?retryWrites=true&w=majority",
  { useUnifiedTopology: true, useNewUrlParser: true }
);
mongoose.connection.on("open", () => {
  console.log("Connection establish complete");
});
// =======****router set****===========
app.use("/auth", auth);
app.use("/operation", operation);
// ======*****error handel middleware**********=================
app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
// ==========***********Port setup************===============
app.listen(process.env.PORT || 9000, () => {
  console.log("9000 port ready to start.");
});
