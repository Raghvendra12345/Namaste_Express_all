const express = require("express");
require("./config/db.js");
const PORT = 7800;
const User = require("./models/user.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userAuth=require("./Midddleware&Error_Handling/auth.js")

const app = express();

app.use(express.json()); //using express json to convert json object into javascript object

app.use(cookieParser());

app.patch("/update/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  try {
    const AllowedUpdates = ["age", "skills", "photoUrl", "about", "gender"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      AllowedUpdates.includes(k),
    );

    if (!isUpdateAllowed) {
      return res
        .status(400)
        .json({ error: "Update Not allowed for this section" });
    }

    if (data.skills && data.skills.length > 7) {
      return res.status(400).json({ error: "Can't add more skills than 7" });
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json("Something went wrong" + err.message);
  }
});

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
app.delete("/deleteId/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByIdAndDelete(userId);

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({ message: "User Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" + err.message });
    console.log(err.message);
  }
});

app.post("/signup", async (req, res) => {
  

  const { firstName, lastName, email, password } = req.body;

  //Creating insantance of the User Model

  try {
    const saltrounds = 20;

    const passwordHash = await bcrypt.hash(password, saltrounds);
    

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      res.status(401).json({ error: "It is a used id" });
    }

    console.log(req.body);
    await user.save();

    res.status(201).json({ message: "User saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(402).json({ error: "User not found" });
    }

    const isPasswordValid = await user.validatePassword(password)

    if (isPasswordValid) {
      //Create JWT token
        
      const token=await user.getJWT()
      // //ADD token to cookie and send the response
      res.cookie("token", token,{
        expires:new Date(Date.now()+8*360000),
      });
      res.status(200).json({ message: "User LoggedIn Successfully" });
      console.log("User Logged In");
    } else throw new Error("Invalid Credentials");
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
});

app.get("/profile",userAuth,async (req, res) => {
  try {

    //Validate the token
    const user=req.user

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Something Error Occured   " + err.message);
  }
});

app.post('/sendConnectionRequest',userAuth,async(req,res)=>{
  const user=req.user

  res.status(200).send(user.firstName+" sent the connection request")
})

app.listen(PORT, () => {
  console.log("server is running fine");
});
