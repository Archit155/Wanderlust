if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
console.log("Environment:", process.env.NODE_ENV);
console.log("Mongo URI:", );

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const UserRouter = require("./routes/user.js");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("express-flash");
const Review = require("./models/review.js");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");
const multer  = require('multer')


app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const DB_Url = process.env.ATLASDB_URL;
async function main(){
   await mongoose.connect(DB_Url); 

};

main().then(() => {
    console.log("✅ MongoDB Connection Successful");

    app.listen(port, () => {
        console.log("🚀 Server is listening on port", port);
    });

}).catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
    
});
const store = MongoStore.create({
    MongoStore,
    mongoUrl: DB_Url,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:  24*3600,
});

store.on("error",(err)=>{
    console.log("ERROR is MongoStore ",err);
})

const sessionOptions = {
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




   app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     res.locals.Curruser = req.user;
    next();
   });
 
//    app.get("/demo",async (req,res)=>{

//     let fakeUser = new User({
//         email: "architchoubey095@gmail.com",
//         username: "archit__06"
//     });

//    let register =  await User.register(fakeUser,"helloworld");
//    res.send(register);

//    })



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",UserRouter);
   
   app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404,"Page Not Found"));
});

    app.use((err,req,res,next)=>{
       let {status=500,message} = err;
       res.status(status).render("Error.ejs",{message })
    //    res.status(status).send(message);
    });

