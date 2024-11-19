import Appointment from "../models/Appointment";
import { Request, Response } from "express";

const getMyAppointments = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.find({ user: req.userId })
      .populate("")
      .populate("user");

    res.json(appointment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

export default { getMyAppointments };
