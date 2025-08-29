const express =require ("express");
const app= express();
const mongoose =require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/Urbanest";
const Listing =require("./models/listings.js")

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


app.get(("/"),(req,res)=>{
  res.send("on root ")
})
//index route
app.get(("/listings"),async (req,res)=>{
    const allisting =await Listing.find({})
    res.render("listings/index.ejs",{  allisting});
});
//show route

app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
})
app.listen(3000,()=>{
    console.log("app is listening to port 3000")
})