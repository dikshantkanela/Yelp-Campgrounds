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
const reviews = require("../controllers/reviews");


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
router.post("/campgrounds/:id/reviews",isLoggedIn,validateReview,catchAsync(reviews.createReview));
  
router.delete("/campgrounds/:id/reviews/:reviewId",isLoggedIn,isAuthorOfReview,catchAsync(reviews.deleteReview));

module.exports = router