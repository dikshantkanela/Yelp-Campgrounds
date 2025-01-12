const express = require("express");
const router = express.Router({mergeParams:true});
const catchAsync = require("../utils/catchAsync")
const ExpressError = require('../utils/ExpressError');
const Joi = require('joi');  
const Campground = require("../models/campground"); //Model

// const Review = require("../models/review");
const {isLoggedIn,isAuthor} = require("../middleware"); // used to check user is logged in or not
const campgrounds = require("../controllers/campgrounds")

// for multer
const {storage} = require("../cloudinary/index"); 
const multer = require("multer");
// const upload = multer({dest:"uploads/"});
const upload = multer({storage}); // TELLING MUTLTER TO STORE IN STORAGE (CLOUDINARY)

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
router.get("/", catchAsync(campgrounds.index)); // ROUTE TO SHOW ALL CAMPGROUNDS

router.get("/new",isLoggedIn,campgrounds.renderNewForm); //FORM FOR A NEW CAMPGROUND

// router.post("/",isLoggedIn,validateCampground, catchAsync(campgrounds.createCampground)); // CREATING A NEW CAMPGROUND
//SINGLE FILE : 
// router.post("/",upload.single("image"),(req,res)=>{
//   console.log(req.body,req.file); //req.body contains text data and req.file contains the uploaded file
//   res.send("IT WORKED!")
// })
// MUTLIPLE FILES : 
// router.post("/",upload.array("image"),(req,res)=>{
//   console.log(req.body,req.files); //req.body contains text data and req.file contains the deatils of uploaded file
//   res.send("IT WORKED!")
// })
//FINAL : FOR UPLOADING
router.post("/",isLoggedIn,upload.array("image",validateCampground),catchAsync(campgrounds.createCampground));

router.get("/:id", catchAsync(campgrounds.showCampground));  //ROUTE TO SHOW DETAIL OF A SPECFIC CAMPGORUND (ID)

router.get("/:id/edit",isLoggedIn,isAuthor,  catchAsync(campgrounds.renderEditForm)); // SHOW EDIT FORM

router.put("/:id",isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground)); // UPDATING A CAMPGROUND

router.delete("/:id",isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground)); // DELETE A CAMPGROUND



module.exports = router;