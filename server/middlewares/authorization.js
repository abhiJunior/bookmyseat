
const auth = (req,res,next)=>{
    console.log("req",req.user)
    const role = req.user?.role 
    console.log("role",role)
    try{
        if (role === "USER"){
            return res.status(403).send("Your are not authorizsed")
        }
        next()
        
    }
    
    catch(e){
        console.error("erorr on auth",e);
       return res.status(500).json({ error: e.message });
    }
    
}

export default auth