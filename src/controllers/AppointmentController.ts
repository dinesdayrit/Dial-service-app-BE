import Appointment from "../models/Appointment";
import { Request, Response } from "express";

const getMyAppointments = async (req: Request, res: Response) => {
  console.log("getting appointments");
  console.log(req.userId);
  try {
    const appointment = await Appointment.find({ user: req.userId })
      .populate("ServiceProvider")
      .populate("user");

    res.json(appointment);
    console.log(appointment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const createAppointment = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const userId = req.userId;
    const { serviceProvider, apointmentDetails, status } = req.body;

    // Validate input fields
    if (
      !apointmentDetails ||
      !apointmentDetails.email ||
      !apointmentDetails.name ||
      !apointmentDetails.addressLine1 ||
      !apointmentDetails.city ||
      !apointmentDetails.appointmentDate
    ) {
      res.status(400).json({ message: "Invalid input data" });
      return;
    }
    // Validate and parse the appointment date
    const appointmentDate = new Date(apointmentDetails.appointmentDate);
    if (isNaN(appointmentDate.getTime())) {
      res.status(400).json({ message: "Invalid appointment date" });
      return;
    }

    // Create a new appointment document
    const newAppointment = new Appointment({
      ServiceProvider: serviceProvider,
      user: userId,
      apointmentDetails: {
        ...apointmentDetails,
        appointmentDate,
      },
      status: status || "placed",
      createdAt: new Date(),
    });

    // Save to the database
    const savedAppointment = await newAppointment.save();

    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default { getMyAppointments, createAppointment };
