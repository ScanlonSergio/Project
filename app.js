//******To Use All the Necessary Packages******
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
//var seedDB = require("./seeds");

//>>>>>>>>>>>>>>>>>Database Schema Configuration<<<<<<<<<<<<<<<<<<<\\
//******To Use All the Schemas from the Respective Files*******
var Campground = require("./models/campground"),
       Comment = require("./models/comment"),
          User = require("./models/user");
        

//>>>>>>>>>>>>>>>>Routes Configuration Files<<<<<<<<<<<<<<<<<<<<<\\
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/auth");

/* -------------Connect DB Without Environment variables---------------*\
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>LOCAL DATABASE URL<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
//****Creates a New DB yelp_camp if it doesn't exist or use if it does exist*****\\
//mongoose.connect("mongodb://localhost/yelp_camp", {useUnifiedTopology: true, useNewUrlParser: true});


// >>>>>>>>>>>>>>>>>>>>>>>>....ONLINE DATABASE URL....<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
//**********To link to DB on Mongo Atlas...Online version for mongoDB************\\
mongoose.connect("mongodb+srv://Sergio:scanny4477@mycluster-gr1o6.mongodb.net/test?retryWrites=true&w=majority", {
      useUnifiedTopology: true,
      useNewUrlParser: true
      //useCreateIndex: true
    }).then(() => {
          console.log("Connected to DB");
    }).catch(err => {
      console.log("error", err);
    });
*/

// -------------Connect DB With Environment variables--------------- \\
//Giving local DB link as th back-up Url so the app doesnt crash.....\\
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url, {
       useUnifiedTopology: true, 
       useNewUrlParser: true
     }).then(() => {
          console.log("Connected to DB");
    }).catch(err => {
      console.log("error", err);
    });

//To Extract Body and Request Parameters
app.use(bodyParser.urlencoded({extended: true}));

//To avoid writing Extensions for all ejs Files.
app.set("view engine", "ejs");

//To use the CSS files from Public Directory
app.use(express.static(__dirname + "/public"));

//For Edit and Delete Routes as HTML forms only supports GET and POST methods
app.use(methodOverride("_method"));

//For Displaying Flash Messages(Errors & Success)
app.use(flash());         

//Used to create three different campgrounds everytime a server starts
//seedDB();     //seed the Database..

//For getting the Timestamp at which the comment was created using moment.js
app.locals.moment = require('moment');

//>>>>>>>>>>>>>>>>>>>>Passport Configuration<<<<<<<<<<<<<<<<<<<<\\
app.use(require("express-session")({
  secret: "gimme a pikaaboooooooom",       //Key used for Encryption and Decryption of Session Data.
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));   //To pass the LocalStrategy to be used for Authentication is passed to passport.
passport.serializeUser(User.serializeUser());           //To Encrypt/Encode Session Data using the Secret.
passport.deserializeUser(User.deserializeUser());       //To Decrypt/Decode Session Data using the Secret.


//To send currentUser to all templates(ejs files) without passing it in each route.
app.use(function(req, res, next){
  res.locals.currentUser = req.user;            //to send the logged In User's Name and Id to all the Templates.
  res.locals.error = req.flash("error");        //to send the error message to all templates.
  res.locals.success = req.flash("success");    //to send the success message to all templates.
  next();
})


//Main Routes moved to "/routes/campgrounds.js"


//Comment Routes Moved To "/routes/comments.js"\\


//Authentication Routes moves to "/routes/auth.js"\\

//To Use the Models from the Schema files
app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


const PORT = process.env.PORT || 80;

//To start the Server
app.listen(PORT, () =>
	console.log("Yelcamp Server is ready to be used and is running on port " + PORT));




//style="display:flex; flex-wrap:wrap;"  for images with different height in the row