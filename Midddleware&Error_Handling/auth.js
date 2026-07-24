const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res,next) => {
  try {
    const { token } = req.cookies;
    

    if (!token) {
      throw new Error("Invalid TOKEN");
    }

    const decodedMessage = jwt.verify(token, "D@!SecretKey",{expiresIne:"1d"});
    console.log(decodedMessage);

    const { _id } = decodedMessage;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user=user

    next();
  } catch (err) {
    res.status(500).json("Error " + err.message);
  }
};

module.exports = userAuth;
