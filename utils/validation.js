const User = require("../models/user.js");

const validateEditProfile=async(req,res)=>{
    
    const data=req.body
    try{
        const isUpdateAllowed=["skills","age","gender","about","photoURL","firstName","lastName"]

        const upadateKeys=Object.keys(data).every(
            (k)=>isUpdateAllowed.includes(k)
        );

    }
    catch(err){
        res.status(500).send("ERROR "+err.message)
    }

    
}

module.exports={validateEditProfile}