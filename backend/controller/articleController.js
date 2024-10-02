const { default: slugify } = require("slugify");
const { Article } = require("../model/article");
const jwt = require("jsonwebtoken");
const { User } = require("../model/model");
require("dotenv").config();

const globalArticleDisplay = async (req, res) => {
  try {
    const allArticles = await Article.find({});
    return res.status(200).json({ article: allArticles });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};
const createNewArticle = async (req, res) => {
  const { title, description, body, tagList } = req.body;
  //   console.log("Request body:", req.body);
  if (!title || !description || !body)
    return res
      .status(400)
      .json({ error: "title, discriotion and body required" });
  try {
    const slug = title.toLowerCase().replace(/ /g, "-");
    const existingArticle = await Article.findOne({ slug });
    if (existingArticle)
      return res.status(400).json({ error: "Article title already exists" });
    const newArticle = new Article({
      title,
      description,
      body,
      tagList,
      author: req.user.userId,
      slug,
    });
    await newArticle.save();
    console.log("new article is ", newArticle);
    return res
      .status(201)
      .json({ message: "Article succefully created", article: newArticle });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
const editExistingArticle = async (req, res) => {
  const { slug } = req.params;
  const { title, description, body, tagList } = req.body;
  try {
    const article = await Article.findOne({ slug });
    if (!article) return res.status(404).json({ error: "Article not found" });
    if (title) {
      article.title = title;
      const newSlug = title.toLowerCase().replace(/ /g, "-");
      const existingArticle = await Article.findOne({ slug: newSlug });
      if (
        existingArticle &&
        existingArticle._id.toString() !== article._id.toString()
      ) {
        return res.status(400).json({ error: "Article title already exists" });
      }
      article.slug = newSlug;
    }
    if (description) article.description = description;
    if (body) article.body = body;
    if (tagList) article.tagList = tagList;
    await article.save();
    return res
      .status(200)
      .json({ message: "Article updated successfully", article });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
};
const deleteArticle = async (req, res) => {
  const { slug } = req.params;
  try {
    const articleFound = await Article.findOne({ slug });
    if (!articleFound) {
      return res.status(404).json({ error: "Article not found" });
    }
    if (articleFound.author.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this article" });
    }
    await Article.deleteOne({ slug });
    return res.status(204).json({ message: "Article deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
const handleFavoriteArticle = async(req,res)=>{
  const { slug } = req.params;
  const userId = req.user.userId;
  try{
    const article = await Article.findOne({ slug });
    if(!article) return res.status(400).json({ message: "Article not found"})
    if(article.favoritedBy.includes(userId)) return res.status(400).json({ message: "Article already unfavorited"});
     
    article.favoritedBy.push(userId);
    article.favoritesCount += 1;
    await article.save();

    const user = await User.findById(userId);
    user.favorites.push(article._id);
    await user.save();

    return res.status(200).json({ message: "Article favorited successfully", article });
  }catch(err){
    console.error(err);
    return res.status(500).json({ message: "error is provided" ,error: err.message });
  }; 
}
const handleUnfavoriteArticle = async (req, res)=>{
  const { slug } = req.params;
  const userId = req.user.userId;
  try{
    const article = await Article.findOne({slug});
    if(!article) return res.status(404).json({ message: "Article not found"})
    if(!article.favoritedBy.includes(userId)) return res.status(400).json({ message: "Article cannot be unfollowed"})
    article.favoritedBy = article.favoritedBy.filter( (favoriteId)=> favoriteId.toString() !== userId);
    article.favoritesCount -= 1;
    await article.save();

    const userCurrent = await User.findById(userId);
    userCurrent.favorites = userCurrent.favorites.filter(
      (favroitesId)=> favroitesId.toString() !== article._id.toString());
    await userCurrent.save();
    return res.status(200).json({ message: 'succesfully unfavorited', article})
  }catch(err){
    console.error(err);
    return res.status(500).json({ message: "internal error" ,error: err.message });
  };
}

module.exports = {
  globalArticleDisplay,
  createNewArticle,
  editExistingArticle,
  deleteArticle,
  handleFavoriteArticle,
  handleUnfavoriteArticle
};

// Article Routes:

// GET /api/articles → Fetch global feed.
// POST /api/articles → Create a new article (requires authentication).
// PUT /api/articles/:slug → Edit an existing article.
// DELETE /api/articles/:slug → Delete an article.
