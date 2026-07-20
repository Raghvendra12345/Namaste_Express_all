const express=require("express")
require('./config/db.js')
const PORT=7800
const User=require("./models/user.js")
console.log(User);
console.log(typeof User);

const app=express()

app.use(express.json())  //using express json to convert json object into javascript object

//GET All Data
app.get("/getdata", async(req, res) => {
    const data=await User.find()
    
     try{
         console.log(data)
    res.status(200).json(data)

     }
     catch(err){
        res.status(500).json({error:"Something went wrong"})
     }

});

//GET single Data
app.get('/onedata',async(req,res)=>{
    const userEmail=req.body.email
    try{
        const user=await User.findOne({email:userEmail})
       res.status(200).json(user)

    }
    catch(err){
        res.status(500).json({error:"Something went wrong"})
        console.log(err.message)
    }

    
})



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

