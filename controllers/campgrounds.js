const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({}); //use async only when we routerly query
  res.render("campgrounds/index.ejs", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new.ejs"); //to create a new campground
};

module.exports.createCampground = async (req, res, next) => {
  //  if(!req.body.campground){
  //     throw new ExpressError("Invalid Campground Data",400); // if we try to do cleverness with postman
  //   }
  ` // if(!req.body.campground.title){
      //    // too much code 
      // }
      // if(!req.body.campground.price){
    
      // }`;
  const campground = new Campground(req.body.campground);
  const images = req.files.map(f=>({url:f.path,filename:f.filename})); //TAKE ALL UPLOADED IMAGES FROM req.files AND THEN STORE THEM IN N ARRAY OF OBJECT
  campground.images = images; 
  campground.author = req.user._id; // THE AUTHOR OF THE CAMPGROUND IS THE LOGGED IN USER WHEN A NEW CAMPGROUND IS CREATED
  await campground.save();
  console.log(campground)
  req.flash("success", "Successfully created a New Campground!"); //FLASH MSG
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    //route to show detail of a specfic campgorund (ID)
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("author"); // TO SHOW NAME OF AUTHOR OF CAMPGROUNDS AS WELL AS NAME OF AUTHOR OF REVIEW
    console.log(campground);
    if(!campground){ // for ERROR FLASHING IF CAMPGROUND NOT FOUND!
      req.flash("error","Campgorund Not Found!")
      return res.redirect("/campgrounds")
    }
    // console.log(campground);
    res.render("campgrounds/show.ejs", { campground });
};

module.exports.renderEditForm = async (req, res) => {  
    const { id } = req.params;  //edit wale form me tujhe ek specific camp ka data bhejna hai
    const campground = await Campground.findById(id);
    if(!campground){
      req.flash("error","Campground Not Found!")
      return res.redirect("/campgrounds");
    }
    
    
    
    res.render("campgrounds/edit.ejs", { campground });  //essentially first step is to got to a edit form!
};

module.exports.updateCampground = async (req, res) => { // form sends this PUT request
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    const editImages = req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.images.push(...editImages); // only UPDATE THE ARRAY;
    await campground.save();
    // Redirect to the show page of the updated campground
    req.flash("success","Campground Updated Successfully!");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req,res)=>{
    const {id}  = req.params;
    const camp = await Campground.findById(id);
    if(!camp.author.equals(req.user._id)){  // ENSURE ONLY THE AUTHOR CAN DELETE AND NOT NON-AUTHOR THE SIGNED IN PERSON
       req.flash("error","You do not have permission to do that!");
       return res.redirect(`/campgrounds/${id}`);
    }
   
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds")
};