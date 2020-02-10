var mongoose = require("mongoose");
var moment = require("moment");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
	passport: String,
	firstName: String,
	lastName: String,
	email: String,
	avatar: {type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTKy8Cd5kK7tjLtG34Xo7iSr6NUPCi3mASYiPSkFEd5qnxaEjPU"},
	joined: { type: String, default: moment().format("dddd, MMMM Do YYYY") },
    isAdmin: {type: Boolean, default: false}   //variable for determining whether the user is Admin or not?
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);