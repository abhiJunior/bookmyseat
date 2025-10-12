import Theatre from "../model/theatre.model.js"

export const getTheatre = async(req,res)=>{
    try{
        const response = await Theatre.findById(req.params.id)
        res.status(200).send(response)
    }catch(e){
        console.log(e)
        res.status(500).send(e.message)
    }
}

export const getTheatres = async(req,res)=>{
    try{
        const respones = await Theatre.find()
        res.status(200).send(respones)
    }catch(e){
        console.log(e)
        res.status(500).send(e.message)
    }
}

export const createTheatre = async(req,res)=>{
    try{
        console.log("Theatre",req.body)
        const resopnse = await Theatre.create(req.body)
        res.status(201).send({status:true,message:"created sucessfully",data:resopnse})
    }catch(e){
        console.log(e)
        res.status(500).send(e.message)
    }
}

export const updateTheatre = async(req,res)=>{
    try{
        const response = await Theatre.findByIdAndUpdate(req.params.id,req.body)
        res.status(200).send({status:true,message:"Successfully Updated",data:response})
    }catch(e){
        console.log(e)
        res.status(500).send({status:false,message:e.message})
    }
}

export const deleteTheatre = async(req,res)=>{
    try{
        const response = await Theatre.findByIdAndDelete(req.params.id)
        res.status(200).send({status:true,message:"Successfully deleted",data:response})
    }catch(e){
        console.log(e)
        res.status(500).send({status:false,message:e.message})
    }
}