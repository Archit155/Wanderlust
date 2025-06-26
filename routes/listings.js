const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapasync = require("../utils/wrapasync.js");
const {storage} = require("../cloudConfig.js");
const multer  = require('multer')
const upload = multer({ storage});

const {isLoggedIn,isOwner,ValidateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

    //New Listing
     router.get("/new", isLoggedIn,listingController.renderNewform);

router.route("/")
.get( wrapasync(listingController.index))//Index Route
.post(isLoggedIn,ValidateListing,upload.single('listing[image]'), wrapasync(listingController.createListing) ); //New listing create route


router.route("/:id")
.get(wrapasync( listingController.ShowListing) ) //show Route
 .put(isLoggedIn,isOwner ,upload.single('listing[image]'),ValidateListing,wrapasync(listingController.updateListing) ) //update Route
.delete(isLoggedIn,wrapasync(listingController.DeleteListing) ); //Destroy Route



    
   //EditRoute
      router.get("/:id/edit",isLoggedIn,wrapasync(listingController.Editlisting));
   
    module.exports = router;