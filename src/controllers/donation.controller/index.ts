import { Request, Response } from "express";
import { DonationAttributes } from "../../config/types";
import Donation from "../../models/Donation";

export const httpAddDonationHandler = async (req: Request, res: Response) => {
  try {
    const { id, DonorId, donationDate, donationTook, Properties } = req.body;

    const newDonationData: DonationAttributes = {
      id,
      DonorId,
      donationDate,
      donationTook,
      Properties,
    };
    const newDonation = await Donation.create(newDonationData);
    return res.status(201).json({
      message: "Donation Added Successfully",
      Donation: newDonation,
    });
  } catch (error) {
    //console.error("Error Adding Donation:", error);
    return res.status(500).json({ message: "Failed To Add Donation" });
  }
};

export const httpGetDonationHandler = async (req: Request, res: Response) => {
  try {
    const { donationId } = req.params;
    const parsedDonationId = parseInt(donationId, 10);
    const donation = await Donation.findByPk(parsedDonationId, {});

    return !donation
      ? res.status(404).json({ message: "Donation Not Fund" })
      : res.status(200).json({ donation });
  } catch (error) {
    //console.error("Error Retrieving Donation:", error);
    res.status(500).json({ message: "Failed To Retrieve Donation" });
  }
};

export const httpGetAllDonationsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const donations = await Donation.findAll();

    res.status(200).json({ count: donations.length, donations });
  } catch (error) {
    //console.error("Error Retrieving Donations:", error);
    res.status(500).json({ message: "Failed To Retrieve Donations" });
  }
};

export const httpEditDonationHandler = async (req: Request, res: Response) => {
  try {
    const { donationId } = req.params;
    const parsedDonationId = parseInt(donationId, 10);

    const { id, DonorId, donationDate, donationTook, Properties } = req.body;

    const updatedDonationData: DonationAttributes = {
      id,
      DonorId,
      donationDate,
      donationTook,
      Properties,
    };

    const [updatedRowsCount] = await Donation.update(updatedDonationData, {
      where: { id: parsedDonationId },
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "Donation Not Found" });
    }

    const updatedDonation = await Donation.findByPk(parsedDonationId);
    if (updatedDonation) {
    }
    return res.status(200).json({
      message: "Donation Updated Successfully",
      Donation: updatedDonation,
    });
  } catch (error) {
    //console.error("Error Editing Donation:", error);
    res.status(500).json({ message: "Failed To Edit Donation" });
  }
};

//TODO:prevent the delete Donor member if there is any donations
export const httpDeleteDonationHandler = async (
  req: Request,
  res: Response
) => {
  const { donationId } = req.params;
  const parsedDonationId = parseInt(donationId, 10);

  try {
    const deletedDonorCount = await Donation.destroy({
      where: { id: parsedDonationId },
    });

    if (deletedDonorCount === 0) {
      return res.status(404).json({ message: "Donation Not Found" });
    }

    return res.status(200).json({ message: "Donation Deleted Successfully" });
  } catch (error) {
    //console.error("Error deleting Donor:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
