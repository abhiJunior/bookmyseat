
import { Schema,model } from "mongoose";    

const threatreSchema = new Schema({
    name : {
        type : String,
        required:true
    },
    location : {
        type: String,
        required: true
    },
    phone :{
        type : Number,
        required:true
    }
})

const Theatre = model ("theatre",threatreSchema)

export default Theatre