const express = require("express");
const app = express();
const methodOverride = require("method-override")
//Mongo Setup
const mongoose = require("mongoose");
const Campground = require("./models/campground"); //Model
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

//To parse the POST requests :
app.use(express.urlencoded({ extended: true }));

//To fake post req as delete and patch/put
app.use(methodOverride("_method"))

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000!");
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/campgrounds", async (req, res) => {
  //route to show all campgrounds
  const campgrounds = await Campground.find({}); //use async only when we apply query
  res.render("campgrounds/index.ejs", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new.ejs"); //to create a new campground
});

app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  //route to show detail of a specfic campgorund (ID)
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show.ejs", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {  
  const { id } = req.params;  //edit wale form me tujhe ek specific camp ka data bhejna hai
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit.ejs", { campground });  //essentially first step is to got to a edit form!
});

app.put("/campgrounds/:id",async(req,res)=>{ //form se aa rhi h ye put request
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground},{new:true})
  res.redirect("campgrounds/show.ejs",{campground}); //always redirect when updated or created
  // res.send(req.body) 

});

app.delete("/campgrounds/:id",async (req,res)=>{
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds")
});
// app.get("/newcamp", async(req,res)=>{
//     const camp = new Campground({title:"Ramada",description:"Situated in Kasuali"});
//     await camp.save();
//     res.send(camp);
// })
