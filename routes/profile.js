const express=require('express')

const profileRouter=express.Router()
const userAuth=require("../Midddleware&Error_Handling/auth.js")
const User = require("../models/user.js");
const {validateEditProfile}=require("../utils/validation.js")



profileRouter.get("/profile/view",userAuth,async (req, res) => {
  try {

    //Validate the token
    const user=req.user

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Something Error Occured   " + err.message);
  }
});


profileRouter.patch("/profile/edit",userAuth ,async (req, res) => {
  
  const data=req.body

  try {

    if(!validateEditProfile(req)){
      throw new Error("Invalid Edit Requests")
    }
    

    // if (!isUpdateAllowed) {     
    //   return res
    //     .status(400)
    //     .json({ error: "Update Not allowed for this section" });
    // }

    if (data.skills && data.skills.length > 7) {
      return res.status(400).json({ error: "Can't add more skills than 7" });
    }


    const loggedInUser=req.user
    

    Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
    

    // const user = await User.findByIdAndUpdate({ _id: userId }, data, {
    //   returnDocument: "after",
    //   runValidators: true,
    // });

    await loggedInUser.save()
    res.status(200).json({message:`${loggedInUser.firstName} was Profile Updated Successfully`});
  } catch (err) {
    res.status(500).json("Something went wrong" + err.message);
  }
});

//GET All Data
profileRouter.get("/getdata", async (req, res) => {
  const data = await User.find();

  try {
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

//GET single Data
profileRouter.get("/onedata", async (req, res) => {
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
profileRouter.delete("/deleteId/:id", async (req, res) => {
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

module.exports=profileRouter