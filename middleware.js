const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
     req.flash("error","You Must Be Signed In First!");
    return res.redirect("/login");
    }
    next();
 }
 
 module.exports = isLoggedIn;