const mongoose = require('mongoose');
const express = require('express');
const { MongooseConnect } = require('./connection')
const app = express();
const PORT = 7000;

app.use(express.json())
const routes = require('./routes/routes')

MongooseConnect('mongodb://127.0.0.1:27017/RealWorld')
.then(()=> console.log('db connected'))
.catch((err)=> console.error("error: ", err))

app.use('/user', routes)

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});
