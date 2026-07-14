

const express=require("express")
const app=express();

app.use((req,res,next)=>{
    console.log('Time:',Date.now())
    next()
})


app.get("/user",
    (req,res,next)=>{
          next();
    },
    (req,res,next)=>{
          next();
    },
    (req,res,next)=>{
          res.send("2nd route handler")
    },
)

//authorization 
app.use('/admin',(req,res,next)=>{
    console.log("Admin is getting checked")
    const token='xyz'

    const isAdminAuthorized=token==="xyz"

    if(!isAdminAuthorized){
        res.status(401).json({error:"Unauthorized request"});
    }
    else next();
})
app.use('/admin/getAllData',(req,res)=>{
    res.send("All data correct")
})

app.use('/',(err,req,res,next)=>{
    if(err){
        res.status(500).send("Something went wrong")
    }
})