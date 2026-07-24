

const mongoose=require("mongoose")
const validator=require("validator")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not a correct email address"+value)
            }
        },
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password"+value)
            }
        },
    },
    age:{
        type:Number,
        min:18,
        
    },
    gender:{
        type:String,
        validate(value){
            if(!["Male","Female","Others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://kristalle.com/team/david-and-audrey-lloyd/dummy-profile-pic/",
         validate(value){
            if(!validator.isURL(value)){
                throw new Error("Not a correct Photo URL"+value)
            }
        },
    },
    about:{
        type:String,
        default:"ˇThis is a default description"
    },
    skills:{
        type:[String],
        minLength:3,
        maxLength:8
    }
},{
    timestamps:true     //it is used to know when the user is created
});


userSchema.methods.getJWT=async function(){
    const user=this;       ///never use arrow function with this keyword

    const token = await jwt.sign({ _id: user._id }, "D@!SecretKey",{
        expiresIn:"7d"
    });
    return token;
}


userSchema.methods.validatePassword=async function(passwordInputByUser){

    const user=this;
    const passwordHash=user.password

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser, 
        passwordHash
    );

    return isPasswordValid;
}

const User=mongoose.model('User',userSchema)

console.log("Exporting User:", User);
module.exports=User