//Create a Middleware Object and Stack up all Middleware functions inside it\\
var middlewareObj = {};

//To access the Schema Files from the model Directory..
var Campground = require("../models/campground");
var Comment = require("../models/comment");


//******To check both if user is Logged In as well as whether the logged In user is the actual author of the campground********\\
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //Check if the user is logged in
      if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
                if(err){
                	      req.flash("error", "Campground not found in Collections..!!");
                          res.redirect("back");
                       }else{
                              //Check if the loggedIn user is actual author of the requested campground
                              if(foundCampground.author.id.equals(req.user._id)){
                                   next();
                                }else{
                                	req.flash("error", "You dont have this Permission for this campground..!!");
                                    res.redirect("back");
                                   }
                            }
             });
                   }else{
                   	req.flash("error", "You need to be Logged In First");
                    res.redirect("back");
                   }
} 


//******To check both if user is Logged In as well as whether the logged In user is the actual author of the comment********\\
middlewareObj.checkCommentOwnership = function(req, res, next){
    //Check if the user is logged in
      if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                          res.redirect("back");
                       }else{
                              //Check if the loggedIn user is actual author of the requested comment
                              if(foundComment.author.id.equals(req.user._id)){
                                   next();
                                }else{
                                  	req.flash("error", "You dont have this Permission for this comment..!!");
                                    res.redirect("back");
                                   }
                            }
             });
                   }else{
                    req.flash("error", "You need to be Logged In First");
                    res.redirect("back");
                   }
} 


//********To chack if user is Logged In*********\\
middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
     return next();
  }
  req.flash("error", "You Need to be Logged In to do this..!!");
  res.redirect("/login");
}


module.exports = middlewareObj;