const Listing = require("../models/listing");



module.exports.index = async(req,res)=>{
 const allListing =   await Listing.find({});
 res.render("listings/index",{allListing});
   
    };

    module.exports.renderNewform = (req,res)=>{
          
            res.render("listings/new");
    
        };

        module.exports.ShowListing =async (req,res)=>{
                    let {id} = req.params;
                    let listing = await Listing.findById(id).populate({path:"reviews",populate:  {path: "author"}, } ).populate("owner");
                    if(!listing){
                          req.flash("error","Listing you requested for does not exist!");
                          res.redirect("/listings");
                    }
                    res.render("listings/show.ejs",{listing});
            
                }

        module.exports.createListing = async (req,res,next)=>{
                    // let {title,description,image,location,country,price} = req.body;
                   
                let url =  req.file.path;
                 let filename =  req.file.filename;
                        let newListing = new Listing(req.body.listing);
                        console.log("🔥 req.body in POST /listings:", req.body);
                        newListing.owner = req.user._id;
                        newListing.image = {url,filename};
                   await newListing.save();
                   req.flash("success","New Listing added");
                    res.redirect("/listings");
                 
                    
            
                };

                  module.exports.Editlisting = async (req,res)=>{
            let {id} = req.params;
            let listing = await Listing.findById(id)
            let OriginalUrl = listing.image.url;
            OriginalUrl = OriginalUrl.replace("/upload","/upload/h_300,w_250");
            res.render("listings/edit",{listing,OriginalUrl});
        };


             module.exports.updateListing =  async (req,res)=> {
                       if(!req.body.listing){
                            throw new ExpressError(400,"Send Valid data for listing");
                        }
                    let {id} = req.params;
        
        
                  const listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});
                  if(typeof req.file != "undefined"){
  let url =  req.file.path;
                 let filename =  req.file.filename;
                 listing.image = {url,filename};
                await listing.save();
                  }
                  
                   if(!listing){
                          req.flash("error","Listing you requested for does not exist!");
                          res.redirect("/listings");
                    }
                    req.flash("success","Listing updated");
                   res.redirect(`/listings/${id}`);
                };

        


           module.exports.DeleteListing =       async (req,res)=>{
            let {id} = req.params;
            let listing = await Listing.findByIdAndDelete(id);
             req.flash("success","Listing Deleted");
            res.redirect("/listings");
    
        };




