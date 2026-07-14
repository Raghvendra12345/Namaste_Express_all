const express=require("express")
const PORT=7800

const app=express()

// app.use('/working',(req,res)=>{
//     res.send("Hello boy")
// },
// )


// app.use("/working",(req,res,next)=>{
//     console.log("Handling 1")
//     next()
// },
// (req,res,next)=>{
//     console.log("Handling 2")
//     res.send("Now its working fine")
// }
// )






app.listen(PORT,()=>{
    console.log("server is running fine")
})

