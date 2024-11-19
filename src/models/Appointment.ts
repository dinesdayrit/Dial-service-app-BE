import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  ServiceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProvider",
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  apointmentDetails: {
    email: { type: String, required: true },
    name: { type: String, required: true },
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
    appointmentDate: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ["placed", "paid", "inProgress", "outForDelivery", "delivered"],
  },
  createdAt: { type: Date, default: Date.now },
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment;
