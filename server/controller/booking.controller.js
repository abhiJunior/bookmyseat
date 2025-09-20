import Booking from "../model/booking.model.js"


export const getTicket = async(req,res)=>{

    try{
        const {userId} = req.params
        console.log(userId)
        const user = await Booking.find({user:userId})
        console.log(user)
        res.status(200).send(user)
    }catch(e){
        console.log(e)
        res.status(500).send(e.message)
    }

}