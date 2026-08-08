
const express=require("express")
const userAuth = require("../Midddleware&Error_Handling/auth")
const userRouter=express.Router()
const ConnectionRequest=require("../models/connectionRequest")
const User=require("../models/user")

const User_Safe_Data="firstName lastName photUrl age gender about skills"

userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user

        const connectionRequest=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName","photoUrl","age","gender","about","skills"]) //It is type of sequelize joins with the help of ref
        res.status(200).json({message:"Data fetched successfully",data: connectionRequest})

    }
    catch(err){
        res.status(500).send("Something went wrong "+err.message)
    }
})

userRouter.get('/user/connections',userAuth,async(req,res)=>{
     try{
        const loggedInUser=req.user

        const connectionRequest=await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id, status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId",User_Safe_Data)
        .populate("toUserId",User_Safe_Data)

        const data=connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }
            
            return row.fromUserId;
        });

        res.json({data})
           
     }
     catch(err){
         res.status(500).json({message:err.message})
     }
})

userRouter.get('/feed',userAuth,async(req,res)=>{
    try{
        

        //User should see all the users cards except
        //0. his own card
        //1.his connections
        //2.ignored people
        //3.already sent the connection request




       const loggedInUser=req.user


       //Find all connection requests (sent + received)
       const connectionRequest=await ConnectionRequest.find({
        $or:[
            {toUserId:loggedInUser._id},
            {fromUserId:loggedInUser._id}
        ]
       }).select("fromUserId toUserId")
    //    .populate("fromUserId","firstName")
    //    .populate("toUserId","firstName")

      
    const hideUsersFromFeed=new Set();
    connectionRequest.forEach((req)=>{
        hideUsersFromFeed.add(req.fromUserId.toString())
        hideUsersFromFeed.add(req.toUserId.toString())
    })

    

    const users=await User.find({
        $and:[
            {_id: {$nin:Array.from(hideUsersFromFeed)}},    //making set database again back to array
            {_id:{$ne:loggedInUser._id}}
        ]
    }).select(User_Safe_Data)


       res.send(users)
    }
    catch(err){
      res.status(500).json({message:err.message})
    }
})
module.exports=userRouter