const express = require("express");
const createError = require("http-errors");
const validateForm = require("../controllers/validateForm");
const { UserModel } = require("../config/db");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    validateForm(req, res, next);
    const { username, password } = req.body;
    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) {
      return next(createError(404, "Please register!"));
    }
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) return next(createError(400, "Invalid credentials!"));
    return res.status(200).json({ message: "Success", username });
  } catch (error) {
    next(createError.InternalServerError(error.message));
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    validateForm(req, res, next);
    const { username, password } = req.body;
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return next(createError(404, "Username already taken!"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ username, password: hashedPassword });
    await user.save();
    req.session.user = {
      username,
      id: user._id,
    };
    return res.status(201).json({ message: "Success", username });
  } catch (error) {
    next(createError.InternalServerError(error.message));
  }
});

module.exports = router;