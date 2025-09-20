import { config } from "dotenv";
config()
import express from "express"
import userRouter from "./routes/user.routes.js";
import movieRouter from "./routes/movie.routes.js";
import theatreRouter from "./routes/theatre.routes.js";
import showRouter from "./routes/show.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import connectTODB from "./congfig/DB_config.js";
import bookingRouter from "./routes/booking.routes.js";

import cookieParser from "cookie-parser";
import cors from "cors"



const app = express();
app.use(cors({
  origin: "http://localhost:5173", // your React app origin
  credentials: true,               // allow cookies
}));
app.use(express.json())

app.use(cookieParser())

app.use("/api/user",userRouter)
app.use("/api/movie",movieRouter)
app.use("/api/show",showRouter)
app.use("/api/theatre",theatreRouter)
app.use("/api/payment", paymentRouter);
app.use("/api/booking",bookingRouter)
app.get("/ping",(req,res)=>{
    res.status(200).send("Server is up and running")
})

app.listen(5000,async()=>{
    await connectTODB()
    console.log("Server is running at http://localhost:5000")
})