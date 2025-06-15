const express = require("express");
const app = express();
const sessions = require("express-session"); 
const flash = require("connect-flash");
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.use(sessions({secret: "my super ssecret sting",resave:false,saveUninitialized:true}));
app.use(flash());

app.use((req,res,next)=>{
 res.locals.success = req.flash("success");
       res.locals.error = req.flash("error");
       next();
})


app.get("/register",(req,res)=>{
    let {name = 'anonymous'} = req.query;
    req.session.name = name;
    if(name == "anonymous"){
req.flash("error","user not registered");
    }else{
  req.flash("success","user registered successfully");
    }
  
        
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
   
    res.render('page.ejs',{name: req.session.name});

})
app.listen(3000,()=>{
   console.log("Server is listening");
})