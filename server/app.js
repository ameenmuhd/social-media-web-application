 const express = require('express');
 const app = express();
 const mongoose = require('mongoose');
 const PORT = 5000;
 const {MONGO_URL} = require('./keys')
 const cors = require('cors')

 mongoose.connect(MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
 })
 mongoose.connection.on('connected',()=>{
    console.log('connected to database');
 })
 mongoose.connection.on('error',(err)=>{
    console.log('Error connecting database',err);
 })

 require("./models/user");
 require("./models/post");
 
 app.use(express.json())
 app.use(cors())

 
 app.use(require('./routes/auth'))
 app.use(require('./routes/post'))
 app.use(require('./routes/user'))
 app.use(require('./routes/admin'))


 app.listen(PORT,()=>{
    console.log('server is running on',PORT);
 }) 