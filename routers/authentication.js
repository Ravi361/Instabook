const express=require('express')
const router=express.Router();
const User=require('../model/user')
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
router.use(require('express-session')({
    secret:"trytfu ytufy ytuyi",
    resave:false,
    saveUninitialized:false
}))
router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.get('/login',function(req,res)
{
       res.render('login')
})
router.post('/login',passport.authenticate('local',{
    failureRedirect:'/login',
       successRedirect:'/landing'}),function(req,res){
    })
router.get('/signin',function(req,res)
{
    res.render('signin')
})
router.post('/signin',function(req,res)
{
    User.register(new User({username:req.body.username,
    fname:req.body.fname,
    lname:req.body.lname,
    email:req.body.email}),req.body.password,function(err,user)
    {
        if(err)
        console.log(err)
        passport.authenticate('local')(req,res,function(){
        res.redirect('/landing')
    })
})
})
router.get('/logout',function(req,res){
    req.logOut();
    res.redirect('/');
})
module.exports=router