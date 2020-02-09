var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
	passport: String,
	isAdmin: {type: Boolean, default: false}   //variable for determining whether the user is Admin or not?
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);