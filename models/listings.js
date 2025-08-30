const mongoose = require("mongoose");
const { Schema } = mongoose; 

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
//     image: {
//   filename: { type: String, default: "listingimage" },
//   url: {
//     type: String,
//     default: "https://via.placeholder.com/400",
//   },
// },
image: {
  filename: { type: String },
  url: { type: String },  // no default
},


    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
