const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js"); // ✅ Correct relative path

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust'); 
}

main().then(() => {
  console.log("Connection Successful");
}).catch((err) => {
  console.log(err);
});

const initDB = async () => {
  await Listing.deleteMany({});
  
  // map over data.data (assuming your data.js exports { data: [...] })
  data.data = data.data.map((obj) => ({
    ...obj,
    owner: '68556e237d60e381b28c82ef'
  }));
  
  await Listing.insertMany(data.data);
  
  console.log("Data was initialized");
}

initDB();
