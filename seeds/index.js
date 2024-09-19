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
      location: `${cities[random1000].city} , ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://picsum.photos/400?random=${Math.random()}`,
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
