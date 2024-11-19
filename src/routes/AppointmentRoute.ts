import express from "express";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import AppointmentController from "../controllers/AppointmentController";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, AppointmentController.getMyAppointments);

router.post("/", jwtCheck, jwtParse, AppointmentController.createAppointment);

export default router;
