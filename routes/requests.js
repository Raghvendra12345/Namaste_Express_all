const express = require("express");

const requestRouter = express.Router();
const userAuth = require("../Midddleware&Error_Handling/auth.js");
const User = require("../models/user.js");
const ConnectionRequest = require("../models/connectionRequest.js");

requestRouter.post("/request/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignore", "interested"];

    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid Status");
    }

    const existingUser = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    const touser = await User.findById(toUserId);

    if (!touser) {
      return res.status(400).json({ message: "User Not Found" });
    }

    // if(fromUserId==toUserId){
    //   return res.status(401).json({message:"Connection request can't be send to the same person"})
    // }

    if (existingUser) {
      return res
        .status(401)
        .json({ message: "Connection request build already" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();

    res
      .status(200)
      .json({
        message:
          req.user.firstName + " is " + status + " in " + touser.firstName,
        data,
      });
  } catch (err) {
    res.status(500).send("ERROR " + err.message);
  }
});

requestRouter.post("/review/:status/:requestId",userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const {status,requestId}=req.params

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status not allowed" });
    }
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });
    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found" });
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.status(200).json({ Message: "Connection Request " + status, data });
  } catch (err) {
    res.status(500).send("ERROR message " + err.message);
  }
});

module.exports = requestRouter;
