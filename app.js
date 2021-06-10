if(process.env.NODE_ENV!=='production')
{
    require('dotenv').config()
}
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./model/user');
const Post = require('./model/post');
const Comment = require('./model/comment');
const Notification=require('./model/notification');
const bodyParser = require('body-parser');
const friendrouter=require('./routers/friend')
const postrouter=require('./routers/posts')
const commentlikerouter=require('./routers/commentlikes')
const authenticationrouter=require('./routers/authentication')
mongoose.connect('mongodb://localhost/instagram', { useNewUrlParser: true , useUnifiedTopology: true})


const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret
})
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
      folder: 'hreview',
      allowedFormats:['jpeg','png','jpg']
    }
  });
const upload=multer({storage})


const app = express();
app.use(require('express-session')({
    secret:"trytfu ytufy ytuyi",
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(function(req,res,next)
{
    res.locals.cuser = req.user;
    res.locals.moment=require('moment')
    next();
})
app.use('',friendrouter)
app.use('',postrouter)
app.use('',commentlikerouter)
app.use('',authenticationrouter)
app.get('/',function(req,res){
    res.render('login')
})
app.get('/landing',isloggedin,function(req,res){
    Post.find({}).populate('comments likes user').exec((err,posts)=>{
        User.find({}).populate({path:'notification',
        populate: { path: 'user' }}).exec(function(err,users){
            res.render('landing',{user:req.user,users:users,posts:posts})
        })
    })
})
app.get('/seenotification/:id',isloggedin,(req,res)=>{
    User.findById(req.params.id).populate({path:'notification',
    populate: { path: 'user' }}).exec((err,user)=>{
        res.render('seenotification',{user:user})
    })
})

app.post('/searchuser',isloggedin,(req,res)=>{
    var a=0
    const user = new RegExp(escapeRegex(req.body.username), 'gi');
    User.find({'username':user},(err,users)=>{
        if(users.length>0)
        a=1
        res.render('searchresult',{users:users,a:a,suser:req.body.username})
    })
})
function isloggedin(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/login')
}
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
app.listen(3000,function()
{
    console.log("server is running")
})