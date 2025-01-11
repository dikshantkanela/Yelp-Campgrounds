const Review = require("./models/review");
const Campground = require("./models/campground");
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

const isAuthor = async(req,res,next)=>{
  const {id} = req.params;
  const camp = await Campground.findById(id);
   if(!camp.author.equals(req.user._id)){  // ENSURE ONLY THE AUTHOR CAN EDIT AND NOT NON-AUTHOR THE SIGNED IN PERSON
     req.flash("error","You do not have permission to do that!");
     return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

const isAuthorOfReview = async(req,res,next)=>{
  const {id,reviewId} = req.params;
  const review = await Review.findById(reviewId);
   if(!review.author.equals(req.user._id)){  // ENSURE ONLY THE AUTHOR CAN EDIT AND NOT NON-AUTHOR THE SIGNED IN PERSON
     req.flash("error","You do not have permission to do that!");
     return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

 module.exports = {storeReturnTo, isLoggedIn,isAuthor,isAuthorOfReview};

 

 