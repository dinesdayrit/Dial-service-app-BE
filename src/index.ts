import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoutes";
import myServicesRoute from "./routes/MyServicesRoute";
import serviceProvidersRoute from "./routes/ServicesProvidersRoute";
import { v2 as cloudinary } from "cloudinary";

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to DB"));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.use("/api/my/user", myUserRoute);
app.use("/api/my/services", myServicesRoute);
app.use("/api/serviceProviders", serviceProvidersRoute);

app.listen(5000, () => {
  console.log("server started on port 5000");
});
