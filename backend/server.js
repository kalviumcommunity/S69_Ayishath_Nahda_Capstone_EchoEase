require('dotenv').config();
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");

const PORT=3000;

const app=express();
app.use(express.json());
app.use(cors());



mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("MongoDB connected");
}).catch((err)=>{
    console.log(err);
});

const authRoutes=require("./routes/authRoutes");
app.use("/api/auth",authRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on: http://localhost:${PORT}`);    
});

