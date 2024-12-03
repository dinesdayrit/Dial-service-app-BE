import { Request, Response } from "express";
import ServiceProvider from "../models/ServiceProvider";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Appointment from "../models/Appointment";

const getMyServiceProvider = async (req: Request, res: Response) => {
  try {
    const services = await ServiceProvider.findOne({ user: req.userId });
    if (!services) {
      return res.status(404).json({ message: "Services not found" });
    }
    res.json(services);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching Services" });
  }
};

const createMyServiceProvider = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const existingServiceProvider = await ServiceProvider.findOne({
      user: req.userId,
    });

    if (existingServiceProvider) {
      return res
        .status(409)
        .json({ message: "User service provider already exists" });
    }

    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    const serviceProvider = new ServiceProvider(req.body);
    serviceProvider.imageUrl = imageUrl;
    serviceProvider.user = new mongoose.Types.ObjectId(req.userId);
    serviceProvider.lastUpdated = new Date();
    await serviceProvider.save();

    res.status(201).send(serviceProvider);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "error creating Services" });
  }
};

const updateMyServiceProvider = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const serviceProvider = await ServiceProvider.findOne({
      user: req.userId,
    });

    if (!serviceProvider) {
      return res.status(404).json({ message: "serviceProvider not found" });
    }

    serviceProvider.serviceProviderName = req.body.serviceProviderName;
    serviceProvider.serviceProviderAbout = req.body.serviceProviderAbout;
    serviceProvider.officeHours = req.body.officeHours;
    serviceProvider.addressLine1 = req.body.addressLine1;
    serviceProvider.city = req.body.city;
    serviceProvider.country = req.body.country;
    serviceProvider.serviceSector = req.body.serviceSector;
    serviceProvider.serviceItems = req.body.serviceItems;
    serviceProvider.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      serviceProvider.imageUrl = imageUrl;
    }

    await serviceProvider.save();
    res.status(200).send(serviceProvider);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "error updating Services" });
  }
};

const getMyServicesAppointments = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const serviceProvider = await ServiceProvider.findOne({ user: req.userId });
    if (!serviceProvider) {
      return res.status(404).json({ message: "service provider not found" });
    }

    const appointments = await Appointment.find({
      ServiceProvider: serviceProvider._id,
    })
      .populate("ServiceProvider")
      .populate("user");

    res.json(appointments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const serviceProvider = await ServiceProvider.findById(
      appointment.ServiceProvider
    );

    if (serviceProvider?.user?._id.toString() !== req.userId) {
      return res.status(401).send();
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json(appointment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unable to update appointment status" });
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

export default {
  getMyServiceProvider,
  createMyServiceProvider,
  updateMyServiceProvider,
  getMyServicesAppointments,
  updateAppointmentStatus,
};
