const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
  title: String,
  image:String,
  price: Number,
  description: String,
  location: String,
  author:{type:mongoose.Schema.Types.ObjectId,ref:"User"}, // associate the author name with the campground
  reviews:[
    {type:mongoose.Schema.Types.ObjectId,
      ref:"Review"
    }
  ]
});

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
