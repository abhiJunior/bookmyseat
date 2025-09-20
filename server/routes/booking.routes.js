import { Router } from "express";
import { getTicket } from "../controller/booking.controller.js";
const router = Router()

router.get("/ticket/:userId",getTicket)

export default router