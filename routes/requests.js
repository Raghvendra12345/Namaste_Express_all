const express=require("express")

const requestRouter=express.Router()
const userAuth=require("../Midddleware&Error_Handling/auth.js")
const User = require("../models/user.js");


requestRouter.post('/sendConnectionRequest',userAuth,async(req,res)=>{
  const user=req.user

  res.status(200).send(user.firstName+" sent the connection request")
})

module.exports=requestRouter