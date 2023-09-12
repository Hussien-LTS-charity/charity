import express, { Router } from "express";
import {
  httpAddDonorHandler,
  httpGetDonorHandler,
  httpGetAllDonorsHandler,
  httpEditDonorHandler,
  httpDeleteDonorHandler,
} from "../../controllers/donor.controller";

const donorRouter: Router = express.Router();

donorRouter.post("/", httpAddDonorHandler);
donorRouter.get("/:donorId", httpGetDonorHandler);
donorRouter.get("/", httpGetAllDonorsHandler);
donorRouter.put("/:donorId", httpEditDonorHandler);
donorRouter.delete("/:donorId", httpDeleteDonorHandler);

export default donorRouter;
