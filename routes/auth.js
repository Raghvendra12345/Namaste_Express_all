

const express=require('express')

const authRouter=express.Router()
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const userAuth=require("../Midddleware&Error_Handling/auth.js")

authRouter.post("/signup", async (req, res) => {
  

  const { firstName, lastName, email, password } = req.body;

  //Creating insantance of the User Model

  try {
    const saltrounds = 10;

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

authRouter.post("/login", async (req, res) => {
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
      console.log(token)
      res.status(200).json({ message: "User LoggedIn Successfully" });
      console.log("User Logged In");
    } else throw new Error("Invalid Credentials");
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
});

authRouter.post('/logout',userAuth,async(req,res)=>{
    try{
        
        // res.clearCookie('token')
        //OR
        res.cookie('token',null,{
            expires:new Date(Date.now())
        })


        res.status(200).json({message:"User Logout"})



    }
    catch(err){
        res.status(500).send("ERROR "+err.message)
    }
})


module.exports=authRouter