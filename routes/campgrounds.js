var express = require("express");
var router = express.Router();       //To replace "app" by "router" for all routes.

//To access the Schema Files from the model Directory..
var Campground = require("../models/campground");

//To Access the Middleware Functions file from the Middleware directory\\
var middleware = require("../middleware");

//#######################==========Default RESTful Routes=============#########################

//********INDEX Route displays all the available campgrounds**********//
router.get("/campgrounds", function(req,res){
	//Get all the campgrounds form DB
	Campground.find({}, function(err, allcampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: allcampgrounds, currentUser: req.user});
		}
	});
});

//*******CREATE Route is used to add a new campground to DB**********//
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
      var name = req.body.name;
      var price = req.body.price;
      var image = req.body.image;
      var desc = req.body.description;
      //Associating the New Campground with the Logged_In User..
      var author = {
                      id: req.user._id,
                      username: req.user.username
                   };

      var newCampground = {name: name, price: price, image: image, description: desc, author: author};
      //campgrounds.push(newcampground);

      Campground.create(newCampground, function(err, newlyCreated){
      	    if(err){
      		      console.log(err);
      	   }else{
            //redirect back to campgrounds page for display
      		    res.redirect("/campgrounds");
      	      }
      });
});

//******NEW Route is used to show a form for creating a new campground********//
router.get("/campgrounds/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

//******SHOW Route which shows more details about a particular campground referred by the ID*******//
router.get("/campgrounds/:id", function(req,res){
          //Find the campground from the DB
          Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
          	if(err){
          		console.log(err);
          	}else{
              //Render the show template with the particular campground.
                res.render("campgrounds/show", {campground: foundCampground});
          	}
    });
});

//***********EDIT Route to show a form to edit a campground************\\
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
     Campground.findById(req.params.id, function(err, foundCampground){
           res.render("campgrounds/edit", {campground: foundCampground});
   });
});

//*********UPDATE Route to submit the changes from the EDIT form************\\
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
     if(err){
        res.redirect("/campground");
     }else{
        res.redirect("/campgrounds/" + req.params.id);
     }
  });
});

//*********Destroy/ Delete Route for deleting campground.*********\\
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
     Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
        }else{
           res.redirect("/campgrounds");
        }
     });
});


module.exports = router;