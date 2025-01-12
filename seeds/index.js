const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers"); //when more than pne thing is exported
//Mongo Setup
const mongoose = require("mongoose");
const Campground = require("../models/campground");
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

const sample = (array) => array[Math.floor(Math.random() * array.length)]; //this call back will return a random element from the passed array!

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author:"677ff91cfe850bc9d726a1e0",
      location: `${cities[random1000].city} , ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: 'https://res.cloudinary.com/dwn7ye8zb/image/upload/v1736685262/YelpCamp/rjypbv46o0se9mowzmuw.jpg',
          filename: 'YelpCamp/rjypbv46o0se9mowzmuw',
        
        },
        {
          url: 'https://res.cloudinary.com/dwn7ye8zb/image/upload/v1736685263/YelpCamp/w17jovhxqeotet6tiowi.jpg',
          filename: 'YelpCamp/w17jovhxqeotet6tiowi',
       
        }
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic iste commodi debitis corporis ullam distinctio voluptatem ipsa nulla provident harum.",
      price:price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
