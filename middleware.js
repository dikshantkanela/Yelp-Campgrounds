const storeReturnTo = (req,res,next)=>{
    if(req.session.returnTo){ // THAT IS WHEN THE USER IS NOT LOGGED IN
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

const isLoggedIn = (req,res,next)=>{
    console.log("Current USER :"  + req.user);
    if(!req.isAuthenticated()){
     req.session.returnTo = req.originalUrl; // ONLY FUNCTIONALITY WHEN THE USER IS NOT LOGGED IN
     req.flash("error","You Must Be Signed In First!");
     return res.redirect("/login");
    }
    next();
 }
 module.exports = {storeReturnTo, isLoggedIn};