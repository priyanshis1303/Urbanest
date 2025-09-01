const express =require ("express");
const app= express();
const mongoose =require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/Urbanest";
const Listing =require("./models/listings.js")
const methodOverride = require("method-override");
const ejsmate=require("ejs-mate")
const Review =require("./models/review.js")
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
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing})
})
//create route
// app.post("/listings",async (req,res)=>{
//     // let listing=req.body.listing;
//     // console.log(listing)
//     const newListing= new Listing(req.body.listing);
//      await newListing.save();
//      res.redirect("/listings");
// });
// CREATE route
app.post("/listings", async (req, res) => {
  let { title, description, price, location, country, image } = req.body.listing;

  const newListing = new Listing({
    title,
    description,
    price,
    location,
    country,
    image: {
      filename: image?.filename || "listingimage",
      url: image?.url && image.url.trim() !== "" 
            ? image.url 
            : "https://via.placeholder.com/400", // fallback only if empty
    },
  });

  await newListing.save();
  res.redirect("/listings");
});

//edit route


app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });});

//update route 
// app.put("/listings/:id",async (req,res)=>{
//       let {id}=req.params;
// await Listing.findByIdAndUpdate(id,{...req.body.listing})
// res.redirect ("/listings")
// })
// UPDATE route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let { title, description, price, location, country, image } = req.body.listing;

  let listing = await Listing.findById(id);

  listing.title = title;
  listing.description = description;
  listing.price = price;
  listing.location = location;
  listing.country = country;

  // only update image if a new one is provided
  if (image?.url && image.url.trim() !== "") {
    listing.image = {
      filename: image.filename || "listingimage",
      url: image.url,
    };
  }

  await listing.save();
  res.redirect(`/listings/${listing._id}`);
});


//delete route 

app.delete("/listings/:id",async (req,res)=>{
      let {id}=req.params;
   deletedListing= await Listing.findByIdAndDelete(id)
      console.log(deletedListing);
      res.redirect("/listings");

})

//reviews
//post
app.post("/listings/:id/reviews", async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    // res.send("new review saved");
    res.redirect(`/listings/${listing._id}`)
});
//delete review
app.delete("/listings/:id/reviews/:reviewId", async (req, res) => {
    try {
        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        res.send("Something went wrong!");
    }
});



// //image
// // PUT route for editing a listing
// app.put("/listings/:id", async (req, res) => {
//   const { id } = req.params;
//   const updatedData = req.body.listing;

//   // Prevent overwriting image with empty value
//   if (!updatedData.image || updatedData.image.trim() === "") {
//     delete updatedData.image;
//   }

//   await Listing.findByIdAndUpdate(id, updatedData, { new: true });
//   res.redirect("/listings");
// });
app.listen(3000,()=>{
    console.log("app is listening to port 3000")
})