const { Article } = require("../model/article");
const { User } = require("../model/model");
const { HashingPasswords, decrypt } = require("../validation");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleNewUserSignUp = async (req, res) => {
  const { username, email, Password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User already exists, Please Login to your Account" });
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

    const token = jwt.sign({ userId: existingUser._id }, process.env.jwtToken, {
      expiresIn: "1h",
    });
    return res
      .status(200)
      .json({ message: "User Succesfully logged In", token: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server Error", error: err });
  }
};
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  try {
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json({
      username: user.username,
      email: user.email,
      bio: user.bio,
      image: user.image,
      favorites: user.favorites,
      followers: user.followers,
      following: user.following
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const { email, bio, image } = req.body;
  try {
    const userExistence = await User.findById(req.user.userId);
    if (!userExistence)
      return res.status(404).json({ message: "user does not exist" });

    if (email && email !== userExistence.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
      userExistence.email = email;
    }

    if (bio) userExistence.bio = bio;
    if (image) userExistence.image = image;
    await userExistence.save();
    return res
      .status(200)
      .json({ message: "User successfully updated", userExistence });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const handleGetProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const getUsername = await User.findOne({ username }).select("-password");
    if (!getUsername)
      return res.status(404).json({ message: "user not found" });

    return res
      .status(200)
      .json({ message: "user Sucessfully found", getUsername });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const handleFollowers = async (req, res) => {
  const { username } = req.params;
  const users_FollowingId = req.user.userId;
  try {
    const userToFollow = await User.findOne({ username });
    if (!userToFollow)
      return res.status(404).json({ message: "User not found" });
    if (userToFollow.followers.includes(users_FollowingId))
      return res
        .status(400)
        .json({ message: "you are already following the user" });

    userToFollow.followers.push(users_FollowingId);
    await userToFollow.save();
    const currentUser = await User.findById(users_FollowingId);
    currentUser.following.push(userToFollow._id);
    await currentUser.save();

    return res.status(200).json({ status: "success" });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const handleUnfollowUser = async (req, res) => {
  const { username } = req.params;
  const users_followingId = req.user.userId;
  try {
    const userToUnfollow = await User.findOne({ username });
    if (!userToUnfollow)
      return res.status(404).json({ message: "User not found" });
    if (!userToUnfollow.followers.includes(users_followingId))
      return res
        .status(400)
        .json({ message: "you are not following this user to unfolow" });

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (followersId) => followersId.toString() !== users_followingId
    );

    await userToUnfollow.save();

    const currentUser = await User.findById(users_followingId);
    currentUser.following = currentUser.following.filter(
      (followingId) => followingId.toString() !== userToUnfollow._id.toString()
    );
    await currentUser.save();
    return res.status(200).json({ status: "unfollowed sucessfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ messsage: "internal error", error: err.message });
  }
};

module.exports = {
  handleNewUserSignUp,
  handleExistingUserLogin,
  getUserProfile,
  updateUser,
  handleGetProfile,
  handleFollowers,
  handleUnfollowUser,
};
