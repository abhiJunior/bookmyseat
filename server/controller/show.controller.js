import mongoose from "mongoose";
import Show from "../model/show.model.js";

export const  createShow = async(req,res)=>{
    const showDeatail = req.body;
    try{
        const response = await Show.create(showDeatail);
        return res.status(201).send(response)
    }catch(e){
        console.error("erorr on creating",e)
        return res.status(500).send({erorr:e.message})
    }
}

export const getShows = async(req,res)=>{
    
    try{
        const movieId = req.query.movieId;
        const movieDate = req.query.date || new Date()

        const data = await Show.aggregate([
            {
                $match:  { movie: new mongoose.Types.ObjectId(movieId)}
            }, 
            {
                $match: { time :{
                    '$gte' : new Date(`${movieDate}T00:00:00.000+00:00`),
                    '$lt' : new Date(`${movieDate}T23:59:59.999+00:00`)
                
                }}
            },
            
            {
                $group: {_id : "$theatre",shows: {$push: "$$ROOT"}}
            },
            {
                $lookup: {
                    from: "theatres",           // collection name in Mongo
                    localField: "_id",
                    foreignField: "_id",
                    as: "theatreDetails"
                }
            },
            { $unwind: "$theatreDetails" }
        ])
        res.status(200).send(data)
    }catch(e){
        console.error("Error on get shows",e);
        res.status(500).send({erorr:e.message})
    }
}

export const getShow= async(req,res)=>{
    const {showId} = req.params
    try{
        const data = await Show.findById(showId).populate("theatre").populate("movie")
        res.status(200).send(data)

    }catch(e){
        console.log("erorr",e)
        res.status(500).send(e.message)
    }
}

export const GetShow = async(req,res)=>{
    try{
        const response = await Show.find()
            .populate("theatre")
            .populate("movie")
        res.status(200).send(response)
    }catch(e){
        console.log(e)
        res.status(500).send(e.message)
    }
}

export const updateShow = async(req,res)=>{
    try{
        const response = await Show.findByIdAndUpdate(req.params.id,req.body)
        res.status(200).send({status:200,message:"Sucessfully Updated",data:response})
    }catch(e){
        console.log(e)
        res.status(500).send(e.message)
    }
}

export const deleteShow = async(req,res)=>{
    try{
        
        const response = await Show.findByIdAndDelete(req.params.id)
        res.status(200).send({status:200,message:"Sucessfull Deleted",data:response})
    }catch(e){
        console.log(e)
        res.status(500).send(e.message)
    }
}

