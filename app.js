const express = require("express");
const app = express();
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
//Mongo Setup
const mongoose = require("mongoose");
const Campground = require("./models/campground"); //Model
const Review = require("./models/review");
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((err) => {
    console.log("DATABASE CONNECTTION ERROR" + err);
  });
//EJS Setup
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs",ejsMate); //an engine for ejs  
//To parse the POST requests :
app.use(express.urlencoded({ extended: true }));

//To fake post req as delete and patch/put
app.use(methodOverride("_method"))

// for try-catch error handling:
const catchAsync = require('./utils/catchAsync');

// Error class : 
const ExpressError = require('./utils/ExpressError');

// Data Validator : 
const Joi = require('joi');
const { request } = require("http");

const campgrounds = require("./routes/campgrounds");

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000!");
});

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


app.use("/campgrounds",campgrounds);

app.get("/", (req, res) => {
  res.render("home.ejs");
});



app.post("/campgrounds/:id/reviews",validateReview,catchAsync(async(req,res)=>{
  const {id} = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review) //unique form format
  campground.reviews.push(review);
  await review.save(); 
  await campground.save();
  console.log(review);
  res.redirect(`/campgrounds/${id}`);
}));

app.delete("/campgrounds/:id/reviews/:reviewId",catchAsync(async(req,res)=>{
  const {id,reviewId} = req.params;
  const camp = await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}) //update the campground to remove the review from the campground!
  const review =  await Review.findByIdAndDelete(reviewId); // delete the review individually from its collection
  res.redirect(`/campgrounds/${id}`);

}))

app.all("*",(req,res,next)=>{
  next(new ExpressError("Page not found",404));
})

app.use((err,req,res,next)=>{
  const {statusCode = 500} = err;
  if(!err.message){
    err.message ="Something went wrong!";
  }
  res.status(statusCode).render('error.ejs',{err})
})


// app.get("/newcamp", async(req,res)=>{
//     const camp = new Campground({title:"Ramada",description:"Situated in Kasuali"});
//     await camp.save();
//     res.send(camp);
// })
