const mongoose = require("mongoose");
const { Schema } = mongoose;

const useSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    // match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character']
  },
  bio: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "userCredentials",
    },
  ],
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Article",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "userCredentials",
    },
  ],
});

const User = mongoose.model("userCredentials", useSchema);
module.exports = {
  User,
};
