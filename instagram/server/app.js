const express = require('express');
const req = require('express/lib/request');
const mongoose = require('mongoose');
const {MONGOURI} = require('./keys');
const app= express();
const PORT=5000;
require('./models/User');   
app.use(express.json())
app.use(require('./Routes/auth'));

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
mongoose.connection.on('connected',()=>{
    console.log("connected to mongoDB successfully");
})
mongoose.connection.on('error',(err)=>{
    console.log("error in connecting mongoDb ",err);
})


app.listen(PORT,()=>{
    console.log("server is running on port ",PORT);
})