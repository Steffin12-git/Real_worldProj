const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    author:{
        type : Schema.Types.ObjectId,
        ref: 'userCredentials',
        required: true
    },
    article:{
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Comment = mongoose.model('Comment', commentSchema);
module.exports = {Comment};