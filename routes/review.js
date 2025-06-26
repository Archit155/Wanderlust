const express = require("express");
const router = express.Router({mergeParams:true});
const wrapasync = require("../utils/wrapasync.js");
// const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn,isReviewAuthor,ValidateReview} = require("../middleware.js");
const reviewController = require("../controllers/review.js");


//Reviews route

router.post("/",isLoggedIn,ValidateReview,wrapasync( reviewController.createReview));


//Delete review route

   router.delete("/:rid",isLoggedIn,isReviewAuthor,wrapasync(reviewController.deleteReview));

   module.exports = router;