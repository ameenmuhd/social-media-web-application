const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    postedBy:{
        type:ObjectId,
        require:true,
        ref:"User"
    },
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
},{timestamps : true}) 

mongoose.model("Product",productSchema)