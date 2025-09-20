import { Router } from "express";
import { createMovie,getMovies,deleteMovie,getMovie } from "../controller/movie.controller.js";
import { updateMovie } from "../controller/movie.controller.js";
import isLoggedIn from "../middlewares/authentication.js";
import auth from "../middlewares/authorization.js";

const router = Router();

router.post("/",isLoggedIn,auth,createMovie);
router.get("/list",getMovies)
router.get("/:id",getMovie)
router.put("/:id",isLoggedIn,auth,updateMovie)
router.delete("/:id",isLoggedIn,auth,deleteMovie)


export default router