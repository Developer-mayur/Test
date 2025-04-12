import express from "express"
import mongoose from "mongoose";
import router from "./route/userRouter.js"
import "dotenv/config";
const app =express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
let Port =process.env.PORT;

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DATABASE CONNECTED")
}).catch((Error)=>{
    console.log(Error);
})



app.use("/",router);
app.listen(Port,()=>{
    console.log(`Server started at ${Port}`)
})