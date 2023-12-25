const mongoose = require("mongoose");
require("dotenv").config();

const connection = mongoose.connect(process.env.MONGODB_URI);

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel, connection };
