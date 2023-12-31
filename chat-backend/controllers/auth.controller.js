const createError = require("http-errors");
const bcrypt = require("bcrypt");
const { UserModel } = require("../config/db");

module.exports = {
  verifyLogin: async (req, res, next) => {
    if (req.session?.user && req.session?.user?.username) {
      return res.json({ loggedIn: true, username: req.session.user.username });
    } else {
      return res.json({ loggedIn: false });
    }
  },
  handleLogin: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const existingUser = await UserModel.findOne({ username });
      if (!existingUser) {
        return next(createError(400, "Please register!"));
      }
      const isValidPassword = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isValidPassword)
        return next(createError(400, "Invalid credentials!"));
      req.session.user = {
        username,
        id: existingUser._id,
      };
      return res
        .status(200)
        .json({ message: "Success", username, loggedIn: true });
    } catch (error) {
      next(createError.InternalServerError(error.message));
    }
  },
  handleSignup:async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        return next(createError(400, "Username already taken!"));
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({ username, password: hashedPassword });
      await user.save();
      req.session.user = {
        username,
        id: user._id,
      };
      return res
        .status(201)
        .json({ message: "Success", username, loggedIn: true });
    } catch (error) {
      next(createError.InternalServerError(error.message));
    }
  }
};
