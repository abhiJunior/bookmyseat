import { model,Schema } from "mongoose";    

const showSchema = new Schema({
    time:{
        type: Date,
        required : true
    },
    theatre : {
        type: Schema.Types.ObjectId,
        ref : "theatre",
        required : true,
    },
    movie :{
        type : Schema.Types.ObjectId,
        ref : "movie",
        required : true
    },
    language : {
        type: String,
        required : true
    },
    seats : [
        {
            category: String,
            price : Number,
            arrangements : [[
                {
                    seatNumber : String,
                    status : String
                }
            ]]
        }

    ],
    totalseats :{
        type: Number
    },
    availableseats:{
        type: Number
    }

})

const Show = model("show",showSchema)

export default Show