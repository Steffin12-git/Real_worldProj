const { Article } = require("../model/article");
const { User } = require("../model/model");
const { Comment } = require("../model/comment");

const handleAddComment = async (req, res) => {
  const { slug } = req.params;
  const { body } = req.body;

  if (!body)
    return res.status(400).json({ error: "comment should be written" });
  try {
    const article = await Article.findOne({ slug });
    if (!article) return res.status(404).json({ error: "Article not found" });
    const newComment = await Comment({
      body,
      author: req.user.userId,
      article: article._id,
    });
    await newComment.save();
    return res
      .status(200)
      .json({ message: " comment succesfully added ", comment: newComment });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "internal error" }, { error: err.message });
  }
};

const handleGetComment = async(req, res) =>{
    const { slug } = req.params;
    try{
        const articleFind = await Article.findOne({slug})
        if(!articleFind) return res.status(404).json({error: 'No comments found for this article'})
        console.log("Article ID:", articleFind._id);
        const getComment = await Comment.find({article: articleFind._id}).populate('author','username')
    console.log("ajdkshvJG:-- ",getComment);
        return res.status(200).json({message: 'comments found', comments: getComment})
    }catch(err){
        console.error(err);
        return res.status(500).json({message: 'internal error',error: err.message});  
    }
}

const deleteComment = async (req,res)=>{
  const {slug, id} = req.params;
  console.log(slug)
  console.log(id)
  try{
    const articeFound = await Article.findOne({slug});
    if(!articeFound) return res.status(404).json({ messae: "This particular article doesnt exist" });

    const commentToBeDeleted =await Comment.findById(id)
    if(!commentToBeDeleted) return res.status(404).json({ message: "This particular comment doesnt exist" });

    if(commentToBeDeleted.author.toString() !== req.user.userId) return res.status(403).json({ message: "You dont have the authorizaion to delete the article"});
    await Comment.findByIdAndDelete( id )
    return res.status(200).json({ message: "Comment succesfully deleted"});
  }catch(err){
    console.error(err);
    return res.status(500).json({message: "internal error", error: err.message});
  }
}


module.exports = { 
    handleAddComment,
    handleGetComment,
    deleteComment,
 };
