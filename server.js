const express=require("express")
require('./config/db.js')
const PORT=7800
const User=require("./models/user.js")
console.log(User);
console.log(typeof User);

const app=express()

app.use(express.json())  //using express json to convert json object into javascript object

app.get("/", (req, res) => {
    console.log("GET route hit");
    res.send("Server Working");
});

app.post("/signup",async(req,res)=>{
    console.log("Request received");

    //Creating insantance of the User Model
    const user=new User(req.body)
    try{
    //     const user=new User({ 
    //      firstName:"Stuart",
    //     lastName:"Houser",
    //     email:"stuart@gmail.com",
    //    password:"12345"
    // }
    //    );
    //    console.log("Before save");
    //    await user.save();
    //    console.log("After save");
    console.log(req.body)
    await user.save()

       res.status(201).json({message:"User saved successfully"})

    }
    catch(err){
       res.status(500).json({error:"Error"})
       console.log(err.message)
    }
});


app.listen(PORT,()=>{
    console.log("server is running fine")
})

