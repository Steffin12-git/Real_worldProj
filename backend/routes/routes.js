const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  handleExistingUserLogin,
  handleNewUserSignUp,
  getUserProfile,
  updateUser,
  handleGetProfile,
  handleFollowers,
  handleUnfollowUser
} = require("../controller/controller");
const {
  globalArticleDisplay,
  createNewArticle,
  editExistingArticle,
  deleteArticle,
  handleFavoriteArticle,
  handleUnfavoriteArticle
} = require("../controller/articleController");

const {
  handleAddComment,
  handleGetComment,
  deleteComment,
} = require("../controller/commentController");

//user:- login , sign up ,current user profile, edit user profile
router.post("/users", handleNewUserSignUp);
router.post("/users/login", handleExistingUserLogin);
router.get("/user", verifyToken, getUserProfile);
router.put("/user", verifyToken, updateUser);
router.get("/profiles/:username", verifyToken, handleGetProfile);
router.post("/profiles/:username/follow",verifyToken, handleFollowers);
router.delete("/profiles/:username/follow",verifyToken, handleUnfollowUser);

// Arcticles :-
router.get("/articles", globalArticleDisplay);
router.post("/articles", verifyToken, createNewArticle);
router.put("/articles/:slug", verifyToken, editExistingArticle);
router.delete("/articles/:slug", verifyToken, deleteArticle);
router.post("/articles/:slug/favorite", verifyToken, handleFavoriteArticle);
router.delete("/articles/:slug/favorite", verifyToken, handleUnfavoriteArticle);

//comments:-
router.post("/articles/:slug/comments", verifyToken, handleAddComment);
router.get("/articles/:slug/comments", verifyToken, handleGetComment);
router.delete("/articles/:slug/comments/:id", verifyToken, deleteComment);

module.exports = router;
