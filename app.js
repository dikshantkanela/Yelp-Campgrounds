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

// for static files in public folder
app.use(express.static(path.join(__dirname,"public")))

// Error class : 
const ExpressError = require('./utils/ExpressError');

// Data Validator : 
const Joi = require('joi');
const { request } = require("http");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000!");
});


// ALL MAIN ROUTES
app.use("/campgrounds",campgrounds);
app.use("/",reviews);

// HOME PAGE
app.get("/", (req, res) => {
  res.render("home.ejs");
});





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
