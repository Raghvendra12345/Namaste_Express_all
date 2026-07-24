const express = require("express");
require("./config/db.js");
const PORT = 7800;
const cookieParser = require("cookie-parser");






const app = express();

app.use(express.json()); //using express json to convert json object into javascript object

app.use(cookieParser());

const authRouter=require("./routes/auth.js")
const profileRouter=require("./routes/profile.js")
const requestRouter=require("./routes/requests.js")

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)



app.listen(PORT, () => {
  console.log("server is running fine");
});
