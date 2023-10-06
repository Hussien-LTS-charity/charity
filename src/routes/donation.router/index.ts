import express, { Router } from "express";
import {
  httpAddDonationHandler,
  httpGetDonationHandler,
  httpGetAllDonationsHandler,
  httpEditDonationHandler,
  httpDeleteDonationHandler,
} from "../../controllers/donation.controller";

const donationRouter: Router = express.Router();

donationRouter.post("/", httpAddDonationHandler);
donationRouter.get("/:donationId", httpGetDonationHandler);
donationRouter.get("/", httpGetAllDonationsHandler);
donationRouter.put("/:donationId", httpEditDonationHandler);
donationRouter.delete("/:donationId", httpDeleteDonationHandler);

export default donationRouter;
