let Listing = require("./models/listing.js");
let Review = require("./models/review.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/expressError.js");

module.exports.isLoggedIn = (req,res,next)=>{
  if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
            req.flash("error",("You must be logged in to create a listing."));
           return  res.redirect("/login");
        }
        next();
}

module.exports.saveredirectUrl= (req,res,next)=>{
  if(req.session.redirectUrl){

    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner= async (req,res,next)=>{

  let {id} = req.params;
  let listing =await  Listing.findById(id);
  
  if(!listing.owner._id.equals(res.locals.Curruser._id) ){
      req.flash("error","You are not the owner of this listing");
      return res.redirect(`/listing/${id}`)
  }
  next();

};

module.exports.ValidateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);  // ✅ fixed here
  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.ValidateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);  // ✅ fix here too
  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};



module.exports.isReviewAuthor= async  (req,res,next)=>{

  let {id,rid} = req.params;
  let review = await Review.findById(rid);
  
  if(!review.author._id.equals(res.locals.Curruser._id) ){
      req.flash("error","You are not the author of this review");
      return res.redirect(`/listings/${id}`)
  }
  next();

};