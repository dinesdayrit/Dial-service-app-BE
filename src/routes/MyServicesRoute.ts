import express from "express";
import multer from "multer";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import MyServicesController from "../controllers/MyServicesController";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

// api/my/services

router.get("/", jwtCheck, jwtParse, MyServicesController.getMyServiceProvider);

router.post(
  "/",
  upload.single("imageFile"),
  jwtCheck,
  jwtParse,
  MyServicesController.createMyServiceProvider
);

router.put(
  "/",
  upload.single("imageFile"),
  jwtCheck,
  jwtParse,
  MyServicesController.updateMyServiceProvider
);

export default router;
