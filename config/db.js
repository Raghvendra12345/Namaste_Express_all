

const mongoose=require("mongoose")


const connectDB=async()=>{
    await mongoose.connect(
        "mongodb+srv://Namaste_Node:Raghav%40123@cluster0.piewbgz.mongodb.net/devTinder"
    )
}

connectDB()
.then(()=>{
    console.log("Database connection Established")
    
})
.catch((err)=>{
    console.error("Database connection Not Established",err.message)
})