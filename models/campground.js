const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url:String,
  filename:String,
});

imageSchema.virtual("thumbnail").get(function(){
  return this.url.replace("/upload","/upload/w_200,h_100")
})


const opts = { toJSON: { virtuals: true } }; // INCLUDES THE VIrtUALS AS A PART OF DB RESULt
const campgroundSchema = new Schema({
  title: String,
  images:[imageSchema],
  price: Number,
  description: String,
  location: String,
  geometry:{
    type:{
      type:String,
      enum:["Point"],
      required:true
    },
    coordinates:{
      type:[Number],
      required:true
    }
  },
  author:{type:mongoose.Schema.Types.ObjectId,ref:"User"}, // associate the author name with the campground
  reviews:[
    {type:mongoose.Schema.Types.ObjectId,
      ref:"Review"
    }
  ],

  
},opts);

campgroundSchema.virtual("properties.popUpMarkup").get(function(){
  return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 15)}...</p>`
})


campgroundSchema.pre("findOneAndDelete", async(campgroud)=>{
  console.log("PRE MIDDLEWARE!");
  
})

campgroundSchema.post("findOneAndDelete", async(campground)=>{
  if(campground.reviews.length!==0){
    await Review.deleteMany({_id:{$in:campground.reviews}});
    console.log(campground.reviews); // DELETES ALL REVIEWS ASSOCIATED WHEN A CAMPGROUND IS DELETED
  } 
})  

//EXPORT THE MODEL  BASED ON ABOVE SCHEMA
module.exports = mongoose.model("Campground", campgroundSchema);
