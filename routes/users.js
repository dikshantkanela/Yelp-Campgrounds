const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const User = require("../models/user");
const passport = require("passport");

router.get("/register",(req,res)=>{
    res.render("users/register.ejs")
})
router.post("/register",catchAsync(async(req,res)=>{
    try{
        const {username,email,password} = req.body;
        const user = new User({username,email});
        const registeredUser = await User.register(user,password);
        console.log(registeredUser);
        req.flash("success","Welcome to YelpCamp!")
        res.redirect("/campgrounds");
    } catch(e){
       req.flash("error",e.message);
       res.redirect("/register");
    }
  
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

// to verify login using passport.authenticate("local")
// failureFlash will also show error if any credential is wrong
router.post("/login", passport.authenticate("local",{failureFlash:false,failureRedirect:"/login"}),(req,res)=>{
    const {username} = req.body; // this will be from the form!
    req.flash("success",`Welcome Back, ${username.charAt(0).toUpperCase()+username.slice(1)}`);
    res.redirect("/campgrounds")
});

module.exports = router;

