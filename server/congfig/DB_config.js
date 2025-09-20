import mongoose from "mongoose"
const connectTODB = async()=>{
    try{
        const {connection} = await mongoose.connect(
            `mongodb+srv://userdb:${process.env.DATABASE_PASSWORD}@cluster0.hkbuoog.mongodb.net/bookmyshow_db?retryWrites=true&w=majority&appName=Cluster0`
        )
        if (connection){
            console.log(`Connected to DB Sucessfully at ${connection.host}`)
        }
    }catch(e){
        console.log("Failed to connect to DB",e.message)
    }
}

export default connectTODB