const mongoose=require('mongoose')
const postschema=new mongoose.Schema({
    //image:String,
    image:{
        url:String,
        filename:String
    },
    text:String,
    date:{type:Date,default:Date.now},
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
})
module.exports = mongoose.model('Post',postschema)