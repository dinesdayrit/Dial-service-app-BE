import express from "express";
import { param } from "express-validator";
import ServiceProvider from "../controllers/ServiceProviderController";

const router = express.Router();

router.get("/", ServiceProvider.getAllServiceProvider);

router.get(
  "/:serviceProviderId",
  param("serviceProviderId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("serviceProviderId paramenter must be a valid string"),
  ServiceProvider.getServiceProvider
);

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City paramenter must be a valid string"),
  ServiceProvider.searchServiceProvider
);

export default router;
