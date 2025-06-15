const express = require("express");
const router = express.Router({mergeParams:true});
const wrapasync = require("../utils/wrapasync.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");





const ValidateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);  // ✅ fix here too
  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};



//Reviews route

router.post("/",ValidateReview,wrapasync( async (req,res)=>{
   let listing = await  Listing.findById(req.params.id);

   let newReview = new review(req.body.review);

   listing.reviews.push(newReview);

   await newReview.save();
    await listing.save();

    console.log("new review saved");
     req.flash("success","New Review added");
    res.redirect(`/listings/${listing._id}`)

}));
//Delete review route
   router.delete("/listings/:id/reviews/:rid",wrapasync(async (req,res)=>{

    let {id,rid}= req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:rid}});
    await review.findByIdAndDelete(rid);
 req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);


   }));

   module.exports = router;