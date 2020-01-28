var express = require("express");
var router = express.Router();       //To replace "app" by "router" for all routes.

//To access the Schema Files from the model Directory..
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//To Access the Middleware Functions file from the Middleware directory\\
var middleware = require("../middleware");

//>>>>>>>>>>>>>>>>>>>>>>>>>>Nested RESTful Routes for Comments<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
//========================================================================================\\

//To show the form to Create New Comment
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req,res){
     Campground.findById(req.params.id, function(err,campground){
      if(err){
        console.log(err);
      }else{
         res.render("comments/new", {campground: campground});
      }
   })
})


router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res){
  //Find the Campground By ID
  Campground.findById(req.params.id, function(err,campground){
      if(err){
        console.log(err);
        res.redirect("/campgrounds");
      }else{
        //Name fields in the Form are in the form comment[author] & comment[text] ..therefore (req.body.comment) has both values..
        Comment.create(req.body.comment, function(err, comment){
          if(err){
            req.flash("error", "Something went Wrong..!!");
            console.log(err);
          }else{
            //Associate the comment with the Logged_In User.
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            //Save the comment..
            comment.save();
            //Put the comment to the "comments" array in campgrounds model.
            campground.comments.push(comment);
            //Save the Campgound after adding the Comment..
            campground.save();
            req.flash("success", "Successfully added your comment");
            res.redirect("/campgrounds/" + campground._id);
          }
        });
      }
  });
});


//********To Show a form to EDIT a Comment**********\\
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        res.redirect("back");
      }else{
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
   });
});

//********To Submit the Editted Comment Form (UPDATE Route)*********\\
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
      Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
     if(err){
        res.redirect("back");
     }else{
        req.flash("success","Comment Updated..!!")
        res.redirect("/campgrounds/" + req.params.id);
     }
  });
});

//*********Destroy/Delete Route for deleting comment.*********\\
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
     Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
        }else{
        req.flash("success","Comment Deleted..!!");
        res.redirect("/campgrounds/" + req.params.id);
        }
     });
});


module.exports = router;