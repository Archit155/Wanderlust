const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js"); // ✅ Correct relative path


async function main(){
    mongoose.connect('mongodb://127.0.0.1:27017/wanderlust'); 
}

main().then((res)=>{
    console.log("Connection Successful");
}).catch((err)=>{
    console.log(err);
})


const initDB = async () =>{
 await Listing.deleteMany({});
    await Listing.insertMany(data.data);
    console.log("Data was initialized");
}

initDB();