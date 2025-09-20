import User from "../model/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
export const createUser = async(req,res)=>{

    const userExist = await User.findOne({email : req.body.email})
    if (userExist){
        
        return res.status(403).send({status:false,message:"User already exist"})
    }
    const userData = req.body
    try{
        userData.password = await bcrypt.hash(userData.password,10);
        const data = await User.create(userData)
        
        res.status(200).send({status:true,message: "Successfully register!"})
    }catch(e){
        res.status(500).send(e.message)
    }

    
}

export const login = async(req,res)=>{
    const {email , password } = req.body
    try{
        const validUser = await User.findOne({email:email.toLowerCase()}).select("+password")

        if (!validUser){
            return res.status(401).send({status:false,message:"Invalid Credentails!"})
        }
        const isMatch = await bcrypt.compare(password,validUser.password)
        
        if (!isMatch){
            return res.status(401).send({status:false,message:"Invalid Credentails!"})
        }
        //Generate JWT Token
        const jwtToken = await validUser.generateJWTToken()

        // PUT JWT token in cookie
        res.cookie("token", jwtToken, {
            httpOnly: true,       // prevents JS access
            secure: false,        // set true if using https
            sameSite: "lax",
            path: "/",     // or "none" if cross-site
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).send({status:true,message:"Successfully login!"})

    }catch(e){
        res.status(500).send(e.message)
    }
}

export const profile = async(req,res)=>{
    const userId = req.user.id
    try{
        
        const userDetail = await User.findById(userId)
        
        res.status(200).send(userDetail)
    }catch(e){
        res.status(500).send(e.message)
    }
}

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,     // true in production with https
    sameSite: "lax",  // must match what you set during login
    path: "/"
  });
  return res.status(200).send({ status: true, message: "Successfully logged out!" });
};
