import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    fullName :{
        type: String,
        require: [true,"Name is required"],
        minlength: [3,"Min 3 characters are required"],
        trim : true,
        lowercase:true
    },
    email: {
        type : String,
        require : [true,"email is required"],
        unique : true,
        trim: true,
        lowercase:true

    },
    password:{
        type : String,
        require: [true,"password is required"],
        minlength:[8,"Min 8 characters are required"],
        select:false

    },
    role:{
        type:String,
        enum: ["USER","ADMIN"],
        default: "USER"
    },
},{
    timestamps:true
})
userSchema.methods= {
    generateJWTToken:function(){
        return jwt.sign(
            {id:this._id,role:this.role},
            process.env.JWT_PASSWORD,
            {
                expiresIn: process.env.JWT_EXPIRY
            }
        )
    }
}
const User = model("User",userSchema);

export default User