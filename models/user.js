var mongoose              =require("mongoose"),
    passportLocalMongoose =require("passport-local-mongoose")

var UserSchema = new mongoose.Schema({
  first:String,
  last:String,
  email:String,
  school:String,
  username:String,
  password:String
});

UserSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model("User",UserSchema);
