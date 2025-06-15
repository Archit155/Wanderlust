const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapasync = require("../utils/wrapasync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/expressError.js");

const ValidateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);  // ✅ fixed here
  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};



//RootRoute
router.get("/", async(req,res)=>{
 const allListing =   await Listing.find({});
 res.render("listings/index",{allListing});
   
    });

     router.get("/new",(req,res)=>{

        res.render("listings/new");

    });

    //NewListing
  router.post("/",ValidateListing, wrapasync(async (req,res,next)=>{
            // let {title,description,image,location,country,price} = req.body;
           
         
                let newListing = new Listing(req.body.listing);
                console.log("🔥 req.body in POST /listings:", req.body);
           await newListing.save();
           req.flash("success","New Listing added");
            res.redirect("/listings");
         
            
    
        })
    );


  


   
//ShowRoute
        router.get("/:id",wrapasync(async (req,res)=>{
            let {id} = req.params;
            let listing = await Listing.findById(id).populate("reviews");
            if(!listing){
                  req.flash("error","Listing you requested for does not exist!");
                  res.redirect("/listings");
            }
            res.render("listings/show.ejs",{listing});
    
        })
    );
    

//EditRoute
      router.get("/:id/edit",wrapasync(async (req,res)=>{
            let {id} = req.params;
            let listing = await Listing.findById(id)
            res.render("listings/edit",{listing});
        })
    );

     router.put("/:id",ValidateListing,wrapasync(async (req,res)=> {
               if(!req.body.listing){
                    throw new ExpressError(400,"Send Valid data for listing");
                }
            let {id} = req.params;
           await Listing.findByIdAndUpdate(id,{...req.body.listing});
           if(!Listing){
                  req.flash("error","Listing you requested for does not exist!");
                  res.redirect("/listings");
            }
            req.flash("success","Listing updated");
           res.redirect(`/listings/${id}`);
        })
    );

    
//DeleteRoute
     router.delete("/:id",wrapasync(async (req,res)=>{
            let {id} = req.params;
            let listing = await Listing.findByIdAndDelete(id);
             req.flash("success","Listing Deleted");
            res.redirect("/listings");
    
        })
    );

    

    module.exports = router;