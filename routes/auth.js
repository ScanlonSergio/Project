var express = require("express");
var router = express.Router();       //To replace "app" by "router" for all routes.

//Functions(Methods) from passport package are used.
var passport = require("passport");

//To use User Schema from the models Directory.
var User = require("../models/user");


//ROOT Route showing Home Page
router.get("/", function(req,res){
	res.render("landing");
});


//>>>>>>>>>>>>>>>>>>>AUTHENTICATION Routes<<<<<<<<<<<<<<<<<<<<\\
//************************************************************\\

// To display Register Form
router.get("/register", function(req,res){
  res.render("register");
});

// To Submit the Sign Up information
router.post("/register", function(req,res){
  var newUser = new User({username: req.body.username});     //Important Note: We only store username in DB whereas password is stored as (salt and hash) value of actual password
  User.register(newUser, req.body.password, function(err, user){         // Registers the User in DB.
      if(err){
        req.flash("error", err.message);
        return res.render("register");    //if there is error display Registration Form again.
      }
      passport.authenticate("local")(req,res, function(){   //local -(username & password) . can be twitter, facebook, etc
        req.flash("success", "Welcome to Yelpcamp.." + user.username);
        res.redirect("/campgrounds");
      });
  });
});

// To display Login Form
router.get("/login", function(req,res){
  res.render("login");
});

//On Submitting Login From
router.post("/login", passport.authenticate("local",{               //Note: app.post("/login", middleware,callback)
       successRedirect: "/campgrounds",
       failureRedirect: "/login"
}), function(req,res){
    
});

//The Logout Route
router.get("/logout", function(req,res){
  req.logout();
  req.flash("success", "You have been Logged Out..!!")
  res.redirect("/campgrounds")
})

module.exports = router;