import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoutes";

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to DB"));

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.use("/api/my/user", myUserRoute);

app.listen(5000, () => {
  console.log("server started on port 5000");
});
