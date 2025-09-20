import jwt from "jsonwebtoken"
const isLoggedIn = (req,res,next)=>{
    try{
        const {token} = req.cookies // write cookies
        
        if (!token){
            return res.status(401).send("Login is required")
        }
        const tokenDetails = jwt.verify(token,process.env.JWT_PASSWORD)

        if (!tokenDetails){
            return res.status(401).send("Login is required")
        }

        req.user = tokenDetails
        next()

    }catch(e){
        console.error("authentication erorr",e)
        return res.status(500).send({"error":e.message})
    }


    
    
    
}

export default isLoggedIn