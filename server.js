const express = require("express");
require("./config/db.js");
const PORT = 7800;
const User = require("./models/user.js");
console.log(User);
console.log(typeof User);

const app = express();

app.use(express.json()); //using express json to convert json object into javascript object


app.patch('/update',async(req,res)=>{
  const userId=req.body._id
  const data=req.body

  try{
    const user=await User.findByIdAndUpdate({_id:userId},data)
    res.status(200).json(user)

  }
  catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
  
})

//GET All Data
app.get("/getdata", async (req, res) => {
  const data = await User.find();

  try {
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

//GET single Data
app.get("/onedata", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOne({ email: userEmail });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(err.message);
  }
});

//DELETE data
app.delete("/deleteId", async (req, res) => {
  const userId=req.body._id
  try {
    console.log("Body:", req.body);
    console.log("User ID:", userId);
    const user = await User.findByIdAndDelete({_id:userId});

    

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    } 

  

    if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

    res.status(200).json({ message: "User Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(err.message);
  }
});

app.post("/signup", async (req, res) => {
  console.log("Request received");

  //Creating insantance of the User Model
  const user = new User(req.body);
  try {
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
    console.log(req.body);
    await user.save();

    res.status(201).json({ message: "User saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error" });
    console.log(err.message);
  }
});

app.listen(PORT, () => {
  console.log("server is running fine");
});
