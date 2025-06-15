const mongoose = require("mongoose");
const { listingSchema } = require("../schema");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title: {
        type: String,
        required:true,
    },
    description:String,
    image: {
    filename: String,
    url: {
        type: String,
        default: "https://www.baranselvillas.com/property-images/thumbnail_lg/371/villa-harmony-f295bbd72e.JPG"
    }
},

    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"review",
    }],
});


ListingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in : listing.reviews}})
    }
})

const Listing = mongoose.model("Listing",ListingSchema);
module.exports = Listing;