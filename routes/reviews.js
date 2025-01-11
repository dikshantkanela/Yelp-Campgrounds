const express = require("express");
const router = express.Router({mergeParams:true});
const catchAsync = require("../utils/catchAsync");
const Joi = require('joi');  
// MODELS
const Review = require("../models/review");
const Campground = require("../models/campground"); 
//Error class
const ExpressError = require("../utils/ExpressError")
// isLoggedIn so that no postman requests can be made if the user is not signed in
const {isLoggedIn,isAuthorOfReview} = require("../middleware");



const validateReview = (req,res,next)=>{
    const requestValidator = Joi.object({
      review:Joi.object({
        body:Joi.string().required(),
        rating:Joi.number().min(0).max(5).required()
      }).required()
      
    })
    const {error} = requestValidator.validate(req.body);
    if(error){  
      const joiMsg = error.details.map((e)=>e.message).join(',');
      throw new ExpressError(joiMsg,400);
    }
    else{
      next();
    }
  }
  
//  isLoggedIn so that no postman requests can be made if the user is not signed in
router.post("/campgrounds/:id/reviews",isLoggedIn,validateReview,catchAsync(async(req,res)=>{
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
  }));
  
router.delete("/campgrounds/:id/reviews/:reviewId",isLoggedIn,isAuthorOfReview,catchAsync(async(req,res)=>{ // SHOULD ONLY BE ABLE TO DELETE IF IT IS THE AUTHOR AND LOGGED IN : using isAuthorOfReview & isLoggedIn
    const {id,reviewId} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}) //update the campground to remove the review from the campground!
    const review =  await Review.findByIdAndDelete(reviewId); // delete the review individually from its collection
    req.flash("success","Successfuly Deleted a Review!")
    res.redirect(`/campgrounds/${id}`);
  
}))

module.exports = router