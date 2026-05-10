const User = require("../models/User");

const getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  return res.json(users);
};

module.exports = { getUsers };
