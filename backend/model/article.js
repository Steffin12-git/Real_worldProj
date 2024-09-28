const mongoose = require('mongoose');
const { Schema } = mongoose

const articleSchema =  new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    discription:{
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    taglist:{
        type: [String],
        default: []
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Article = mongoose.model('ArticleInfo', articleSchema);
module.exports={
    Article
}