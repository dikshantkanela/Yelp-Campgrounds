const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review) //unique form format
    campground.reviews.push(review);
    review.author = req.user._id; //THE AUTHOR OF THE REVIEW IS THE LOGGED IN USER WHEN A NEW CAMPGROUND IS CREATED
    await review.save(); 
    await campground.save();
    // console.log(review);
    req.flash("success","Successfully Added a Review!")
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async(req,res)=>{ // SHOULD ONLY BE ABLE TO DELETE IF IT IS THE AUTHOR AND LOGGED IN : using isAuthorOfReview & isLoggedIn
    const {id,reviewId} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}) //update the campground to remove the review from the campground!
    const review =  await Review.findByIdAndDelete(reviewId); // delete the review individually from its collection
    req.flash("success","Successfuly Deleted a Review!")
    res.redirect(`/campgrounds/${id}`);
  
};