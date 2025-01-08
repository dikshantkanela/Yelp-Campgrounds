const express = require("express");
const app = express();
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
//Mongo Setup
const mongoose = require("mongoose");
const Campground = require("./models/campground"); //Model
const Review = require("./models/review");
const User = require("./models/user");

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

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

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

// session
app.use(
  session({
    secret: "thisisnotagoodsecret",
    resave: false,
    saveUninitialized: true,
    cookie:{
      httpOnly:true,
      expires: Date.now() + 1000*60*60*24*7,
      maxAge:1000*60*60*24*7,
    }
  })
);

//passport local : 
app.use(passport.initialize()) //SETS UP PASSPORT FOR AUTH
app.use(passport.session()); // IS USED TO ENSURE PERSISTENT LOGIN ACROSS ALL PAGES (MANAGING SESSIONS)

passport.use(new LocalStrategy(User.authenticate())); //.authenticate IS A METHOD USED TO VERIFY USERNAME AND PASSWORD
passport.serializeUser(User.serializeUser()); // THE PROCESS OF SAVING USER's DATA INTO SESSION AFTER THEY LOG IN 
passport.deserializeUser(User.deserializeUser()); // THE PROCESS OF FETCHING USER DETAILS FROM DB

//flash
app.use(flash());
// Error class : 
const ExpressError = require('./utils/ExpressError');

// Data Validator : 
const Joi = require('joi');
const { request } = require("http");

const campgroundsRoute = require("./routes/campgrounds");
const reviewsRoute = require("./routes/reviews");
const usersRoute = require("./routes/users");

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000!");
});

// FOR FLASH MUST BE BEFORE ANY ROUTE HANDLER!!!!
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error")
  next();
})

// ALL MAIN ROUTES
// FAKE REGISTER USER : 
app.get("/fakeUser",async(req,res)=>{
  const user = new User({email:"colt@gmail.com",username:"colt"});
  const newUser = await User.register(user,"chicken"); // REGISTER THE USER IN THE DB AND ALSO CREATE SALT AND HASH AUTOMATICALLY!
  res.send(newUser);

})
app.use("/campgrounds",campgroundsRoute);
app.use("/",reviewsRoute);
app.use("/",usersRoute);

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
