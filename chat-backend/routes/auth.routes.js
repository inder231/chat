const express = require("express");
const validateForm = require("../controllers/validateForm");
const {
  handleLogin,
  verifyLogin,
  handleSignup,
} = require("../controllers/auth.controller");

const router = express.Router();

router.route("/login").get(verifyLogin).post(validateForm, handleLogin);

router.post("/signup", validateForm, handleSignup);

module.exports = router;
