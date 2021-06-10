const mongoose=require('mongoose')
const Notificationschema=new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
})
module.exports = mongoose.model('Notification',Notificationschema)