import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.listen(5000, () => {
  console.log("server started on port 5000");
});
