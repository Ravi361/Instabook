var mongoose = require('mongoose')
    passportLocalMongoose = require('passport-local-mongoose')
var userschema = mongoose.Schema(
    {
        username:String,
        password:String,
        fname:String,
        lname:String,
        email:String,
        friends:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }],
        post:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }],
        notification:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Notification"
        }]
    }
)
       userschema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User',userschema)