const express =require ("express");
const app= express();
const mongoose =require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/Urbanest";
const Listing =require("./models/listings.js")
const methodOverride = require("method-override");
const ejsmate=require("ejs-mate")

const path=require("path");
main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    })

    


//db connection
async function main(){
    await mongoose.connect(MONGO_URL);
}


//views
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,"/public")))
app.get(("/"),(req,res)=>{
  res.send("on root ")
})
//index route
app.get(("/listings"),async (req,res)=>{
    const allisting =await Listing.find({})
    res.render("listings/index.ejs",{  allisting});
});
//new route
app.get("/listings/new",async (req,res)=>{
    res.render("listings/new.ejs")
})

//show route

app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
})
//create route
app.post("/listings",async (req,res)=>{
    // let listing=req.body.listing;
    // console.log(listing)
    const newListing= new Listing(req.body.listing);
     await newListing.save();
     res.redirect("/listings");
});
//edit route


app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });});

//update route 
app.put("/listings/:id",async (req,res)=>{
      let {id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing})
res.redirect ("/listings")
})

//delete route 

app.delete("/listings/:id",async (req,res)=>{
      let {id}=req.params;
   deletedListing= await Listing.findByIdAndDelete(id)
      console.log(deletedListing);
      res.redirect("/listings");

})

app.listen(3000,()=>{
    console.log("app is listening to port 3000")
})