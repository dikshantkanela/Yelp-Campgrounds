const User = require("../models/user");


module.exports.renderRegister = (req,res)=>{
    res.render("users/register.ejs")
}

module.exports.registerUser = async(req,res,next)=>{
    try{
        const {username,email,password} = req.body;
        const user = new User({username,email});
        const registeredUser = await User.register(user,password); //IT WILL HANDLE .save()
        // console.log(registeredUser);
        req.login(registeredUser,(err)=>{  //TO MAKE SURE REGISTERING ALSO LOGS IN THE USER!
            if(err){
              return  next(err);
            }
            req.flash("success","Welcome to YelpCamp!")
            res.redirect("/campgrounds");
        }); 
       
    } catch(e){
       req.flash("error",e.message);
       res.redirect("/register");
    }
  
};

module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.loginUser = (req,res)=>{
    const {username} = req.body; // this will be from the form!
    const goCorrectUrl = res.locals.returnTo || "/campgrounds"
    req.flash("success",`Welcome Back, ${username.charAt(0).toUpperCase()+username.slice(1)}`);
    res.redirect(goCorrectUrl);
}

module.exports.logoutUser =  (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
};  