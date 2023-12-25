const express = require("express");
const validateForm = require("../controllers/validateForm");
const {
  handleLogin,
  verifyLogin,
  handleSignup,
} = require("../controllers/auth.controller");
const { rateLimiter } = require("../controllers/rateLimiter");

const router = express.Router();

router
  .route("/login")
  .get(verifyLogin)
  .post(rateLimiter(60, 10), validateForm, handleLogin);

router.post("/signup", rateLimiter(60, 10), validateForm, handleSignup);

module.exports = router;
