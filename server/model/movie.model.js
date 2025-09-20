import {Schema,model} from "mongoose"

const movieSchema = new Schema({
    title:{
        type:String,
        required : true
    },
    description:{
        type:String,
        required: true 
    },
    bannerImage:{
        type:String,
        
    },
    thumbnail:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        
    },
    genre: [{
        type: String,
        required: true,
        enum: ["Action", "Drama", "Comedy", "Fantasy", "Sci-Fi"]
    }],
    duration: Number,
    releaseDate: Date,
    languages : [{
        type: String,
        enum : ["English","Hindi","Tamil"]
    }],
    theatre:{
        type: Schema.Types.ObjectId,
        ref:'theatre',
        required:true
    }


})

const Movie =  model("movie",movieSchema);

export default Movie

