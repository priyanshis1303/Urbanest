const express =require ("express");
const app= express();
const mongoose =require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/Urbanest";

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
app.get(("/"),(req,res)=>{
    res.send("on root ");
})
app.listen(3000,()=>{
    console.log("app is listening to port 3000")
})