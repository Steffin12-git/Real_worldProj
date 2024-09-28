const { User } = require("../model/model");
const { HashingPasswords, decrypt } = require("../validation");
const jwt = require('jsonwebtoken')
require('dotenv').config();

const handleNewUserSignUp = async (req, res) => {
  const { username, email, Password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists, Please Login to your Account" });
    }

    const password = await HashingPasswords(Password);

    const newUser = await User.create({ username, email, password });
    return res.status(200).json({ message: "User Succesfully added" });
  } catch (er) {
    console.error(er);
    return res.status(500).json({ msg: "Server Error", error: er });
  }
};

const handleExistingUserLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ msg: "User not found Or does not exist!!!" });
    }

    const isPasswordValid = await decrypt(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Invalid Password!!!" });
    }
    console.log(process.env.jwtToken);
    
    const token = jwt.sign({userId : existingUser.email} , process.env.jwtToken , {expiresIn: '1h'})
    return res.status(200).json({ message: "User Succesfully logged In", token: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server Error", error: err });
  }
};

module.exports = {
  handleNewUserSignUp,
  handleExistingUserLogin,
};
