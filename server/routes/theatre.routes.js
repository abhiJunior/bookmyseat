import { Router } from "express";  
import isLoggedIn from "../middlewares/authentication.js";
import auth from "../middlewares/authorization.js";
import { getTheatre,getTheatres,createTheatre,updateTheatre,deleteTheatre } from "../controller/theatre.controller.js";

const router = Router()

router.get("/",isLoggedIn,auth,getTheatres)
router.get("/:id",isLoggedIn,auth,getTheatre)
router.put("/:id",isLoggedIn,auth,updateTheatre)
router.delete("/:id",isLoggedIn,auth,deleteTheatre)
router.post("/",isLoggedIn,auth,createTheatre)

export default router