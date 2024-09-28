const express = require("express");
const {
  handleExistingUserLogin,
  handleNewUserSignUp,
} = require("../controller/controller");
const router = express.Router();

router.post("/signup", handleNewUserSignUp);
router.post("/login", handleExistingUserLogin);

module.exports = router;
