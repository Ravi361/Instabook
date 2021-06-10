const mongoose=require('mongoose')
const commentschema=new mongoose.Schema({
    text:String,
    author:String,
    date:{type:Date,default:Date.now},
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})
module.exports = mongoose.model('Comment',commentschema)