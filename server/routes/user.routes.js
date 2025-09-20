import { Router } from "express";   
import { createUser,login,profile,logout } from "../controller/user.controller.js";
import isLoggedIn from "../middlewares/authentication.js";
const router = Router();

router.post("/register",createUser)

router.post("/login",login)

router.get("/profile",isLoggedIn,profile)
router.post("/logout",logout)
export default router