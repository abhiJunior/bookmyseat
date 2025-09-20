import { Router } from "express";
import isLoggedIn from "../middlewares/authentication.js";  
import auth from "../middlewares/authorization.js";
import { createShow,getShows,getShow,GetShow,updateShow,deleteShow} from "../controller/show.controller.js";
const router = Router();

router.post("/",isLoggedIn,auth,createShow)
router.get("/list",getShows)
router.get("/all",isLoggedIn,auth,GetShow)
router.get("/:showId",isLoggedIn,getShow)

router.put("/:id",isLoggedIn,auth,updateShow)
router.delete("/:id",isLoggedIn,auth,deleteShow)


export default router