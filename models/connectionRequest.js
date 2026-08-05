
const mongoose=require("mongoose")

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",   //refernce to the User Collection  means building relationship to find requests
        required:true

    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",  
        required:true

    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignore","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`
        }
    }
    
},{
    timestamps:true
})



//saving the data we will pre save and check
connectionRequestSchema.pre("save",async function(){
    const connectionRequest=this;

    //Check if the fromUserId is same as toUserId

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself!")
    }
    
})

const ConnectionRequestModel=new mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports=ConnectionRequestModel