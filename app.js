const express = require("express");
const app = express();

//Mongo Setup
const mongoose = require("mongoose");
const Campground = require("./models/campground") //Model
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
.then(()=>{
    console.log("DATABASE CONNECTED")
})
.catch((err)=>{
    console.log("DATABASE CONNECTTION ERROR" + err)
})
//EJS Setup
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000!");
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/campgrounds", async(req,res)=>{
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index.ejs",{campgrounds})
})
app.get("/campgrounds/:id", async(req,res)=>{  //route to show detail of a specfic campgorund (ID)
  const {id} = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show.ejs",{campground})
})

app.get("/newcamp", async(req,res)=>{
    const camp = new Campground({title:"Ramada",description:"Situated in Kasuali"});
    await camp.save();
    res.send(camp);
})
