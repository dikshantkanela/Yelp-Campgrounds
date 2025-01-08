const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});

// passport-local-mongoose ke jitne bhi methods honge which are used for authentication,hashing,sessions,etc will be added to the Schema!
UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User",UserSchema);
module.exports = User;