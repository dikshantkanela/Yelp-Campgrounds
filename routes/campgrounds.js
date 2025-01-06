const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync")
const ExpressError = require('../utils/ExpressError');
const Joi = require('joi');  
const Campground = require("../models/campground"); //Model
// const Review = require("../models/review");


// JOI Middleware Function : 
const validateCampground = (req,res,next)=>{
    const requestValidator = Joi.object({
      campground:Joi.object({
        title:Joi.string().required(),
        price:Joi.number().min(0).required(),
        image:Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),   
      }).required()
    }) // server side validation
    const {error} = requestValidator.validate(req.body); // validate everything that is coming from form
     
    if(error){ // error aaye to just dont allow user to create the post and give error page
      const joiMsg = error.details.map((e)=>e.message).join(','); // details is an [{}]
      throw new ExpressError(joiMsg,400); 
    }
    else{
      next();
    }
  }

 // WE HAVE /campgrounds as a PREFIX ALREADY!
router.get("/", async (req, res) => {
  //route to show all campgrounds
  const campgrounds = await Campground.find({}); //use async only when we routerly query
  res.render("campgrounds/index.ejs", { campgrounds });
});

router.get("/new", (req, res) => {
  res.render("campgrounds/new.ejs"); //to create a new campground
});

router.post("/",validateCampground, catchAsync(async (req, res,next) => { 
//  if(!req.body.campground){
//     throw new ExpressError("Invalid Campground Data",400); // if we try to do cleverness with postman 
//   }
 ` // if(!req.body.campground.title){
  //    // too much code 
  // }
  // if(!req.body.campground.price){

  // }` 

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);

}));

router.get("/:id", catchAsync(async (req, res) => {
  //route to show detail of a specfic campgorund (ID)
  const { id } = req.params;
  const campground = await Campground.findById(id).populate("reviews");
  console.log(campground);
  res.render("campgrounds/show.ejs", { campground });
}));

router.get("/:id/edit", catchAsync(async (req, res) => {  
  const { id } = req.params;  //edit wale form me tujhe ek specific camp ka data bhejna hai
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit.ejs", { campground });  //essentially first step is to got to a edit form!
}));

router.put("/:id", validateCampground, catchAsync(async (req, res) => { // form sends this PUT request
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
  // Redirect to the show page of the updated campground
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:id",catchAsync(async (req,res)=>{
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds")
}));



module.exports = router;