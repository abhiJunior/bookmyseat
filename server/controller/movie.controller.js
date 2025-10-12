import Movie from "../model/movie.model.js"
import Theatre from "../model/theatre.model.js"

// creating a new movie
export const createMovie = async(req,res)=>{
    try{
        const movieData = req.body
        console.log("movieData",movieData)
        
        let theatre_id = await Theatre.findById(movieData.theatre)
        console.log("getting theatreId :",theatre_id)
        if (theatre_id){
            const data = await Movie.create({...movieData,theatre:theatre_id})
            return res.status(200).send(data)
        }else{
            let theatre = await Theatre.findOne({name:movieData.theatre?.name})
            if (!theatre){
                theatre = await Theatre.create(movieData.theatre)
            }
        
            const data = await Movie.create({...movieData,theatre:theatre._id})
            return res.status(200).send(data)
        }
            
        

    }catch(e){
        console.error("Error creating movie:", e);  // log full error
        res.status(500).json({ error: e.message });
    }
}

export const getMovies = async(req,res)=>{
    try{
        const type = req.query.type // ALL,UPCOMING,LIVE
        const title = req.query.title
        let queryFilter = {
            title: new RegExp(title,'g')
        }

        switch(type){
            case "ALL":{
                break;
            }
            case "UPCOMING":{
                queryFilter.releaseDate =  {$gt: new Date()}; // UPCOMING
                break;
            }
            case "LIVE":{
                queryFilter.releaseDate =  {$lte: new Date()};
                break;
            }
            default:
                break;

        }
        
        
        const moviesData = await Movie.find(queryFilter);
        res.status(200).send(moviesData)
    }catch(e){
        res.status(500).send(e.message)
    }
}

export const getMovie = async(req,res)=>{
    try{
        const response = await Movie.findById(req.params.id)
        res.status(200).send(response)
    }catch(e){
        console.log(e)
        res.status(500).send(e.message)
    }
}
export const updateMovie = async(req,res)=>{
    try{
        console.log("api hit")
        
        console.log(req.params.id)
        const response = await Movie.findByIdAndUpdate(req.params.id,req.body)
        res.status(201).send({status:true,message:"sucessfull updated",data:response})
        return
    }catch(e){
        console.log(e)
        res.status(500).send({status:false,message:"not sucesssfull"})
    }
}

export const deleteMovie = async(req,res)=>{
    try{
        const response = await Movie.findByIdAndDelete(req.params.id)
        res.status(200).send({status:true,message:"sucessfully deleted",data:response})
        return
    }catch(e){
        console.log(e)
        res.status(500).send({status:false,message:"deleted movie"})
    }
}