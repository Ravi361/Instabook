const express=require('express')
const router=express.Router();
const User=require('../model/user')
const Notification=require('../model/notification');
function isloggedin(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/login')
}
router.get('/friends/:id',isloggedin,(req,res)=>{
    User.findById(req.params.id).populate('friends').exec((err,user)=>{
        res.render('friends',{user:user})
    })
})
router.post('/accept/:id/:nid',isloggedin,(req,res)=>{
    User.findById(req.params.id,(err,use)=>{
        use.friends.push(req.user._id);
        req.user.friends.push(use);
        req.user.notification.pull(req.params.nid)
        use.save();
        req.user.save();
        res.redirect('/landing')
    })
})
router.post('/decline/:id',isloggedin,(req,res)=>{
    User.findById(req.user._id,(err,user)=>{
        user.notification.pull(req.params.id)
        user.save();
        res.redirect('/landing')
    })
})
router.get('/removerequest/:id/:user',isloggedin,(req,res)=>{
    User.findById(req.params.user,(err,user)=>{
        user.notification.pull(req.params.id)
        user.save();
        res.redirect('/landing')
    })
})
router.get('/delete/:id',isloggedin,(req,res)=>{
    User.findById(req.params.id,(err,user)=>{
        user.friends.pull(req.user._id),
        req.user.friends.pull(req.params.id),
        user.save();
        req.user.save();
        res.redirect('/landing')
    })
})
router.get('/addfriend/:id',isloggedin,(req,res)=>{
    User.findById(req.params.id,(err,user)=>{
        Notification.create({user:req.user,notitype:"friend"},(err,notif)=>{
            user.notification.push(notif)
            user.save();
            res.redirect('/landing')
        })
    })
})
module.exports=router