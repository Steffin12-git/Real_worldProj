const mongoose = require('mongoose');

const MongooseConnect = async(url) =>{
    return mongoose.connect(url);
}
module.exports = {MongooseConnect};