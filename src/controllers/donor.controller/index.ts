import { Request, Response } from "express";
import { DonorAttributes } from "../../config/types";
import Donor from "../../models/Donor";

export const httpAddDonorHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract the Donor data from the request body
    const {
      id,
      idCopy,
      nationalNumber,
      firstName,
      lastName,
      gender,
      email,
      bankAccountNumber,
      address,
      phoneNumber,
      dateOfBirth,
      donorCategory,
    } = req.body;

    // Create a new Donor instance
    const newDonorData: DonorAttributes = {
      id,
      idCopy,
      nationalNumber,
      firstName,
      lastName,
      gender,
      email,
      bankAccountNumber,
      address,
      phoneNumber,
      dateOfBirth,
      donorCategory,
    };
    const newDonor = await Donor.create(newDonorData);

    // Send a success response
    res
      .status(201)
      .json({ message: "Donor added successfully", Donor: newDonor });
  } catch (error) {
    // Handle any errors
    console.error("Error adding Donor:", error);
    res.status(500).json({ message: "Failed to add Donor" });
  }
};

export const httpGetDonorHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract the Donor ID from the request parameters
    const { DonorId } = req.params;

    // Find the Donor by ID
    const donor = await Donor.findByPk(DonorId, {});

    !Donor
      ? // If Donor is not found, send a not found response
        res.status(404).json({ message: "Donor not found" })
      : // If Donor is found, send the Donor object in the response
        res.status(200).json({ donor });
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving Donor:", error);
    res.status(500).json({ message: "Failed to retrieve Donor" });
  }
};

export const httpGetAllDonorsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Retrieve all Donors from the database
    const Donors = await Donor.findAll();

    // Send the Donors array in the response
    res.status(200).json({ count: Donors.length, Donors });
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving Donors:", error);
    res.status(500).json({ message: "Failed to retrieve Donors" });
  }
};

export const httpEditDonorHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract the Donor ID from the request parameters
    const { DonorId } = req.params;

    // Update the Donor attributes
    const {
      id,
      idCopy,
      nationalNumber,
      firstName,
      lastName,
      gender,
      email,
      bankAccountNumber,
      address,
      phoneNumber,
      dateOfBirth,
      donorCategory,
    } = req.body;

    const updatedDonorData: DonorAttributes = {
      id,
      idCopy,
      nationalNumber,
      firstName,
      lastName,
      gender,
      email,
      bankAccountNumber,
      address,
      phoneNumber,
      dateOfBirth,
      donorCategory,
    };

    const [updatedRowsCount] = await Donor.update(updatedDonorData, {
      where: { id: DonorId },
    });

    if (updatedRowsCount === 0) {
      // If no rows were updated, send a not found response
      res.status(404).json({ message: "Donor not found" });
      return;
    }

    // Find the updated Donor by ID
    const updatedDonor = await Donor.findByPk(DonorId);

    // Send a success response
    res
      .status(200)
      .json({ message: "Donor updated successfully", Donor: updatedDonor });
  } catch (error) {
    // Handle any errors
    console.error("Error editing Donor:", error);
    res.status(500).json({ message: "Failed to edit Donor" });
  }
};

//TODO:prevent the delete Donor member if there is any donations
export const httpDeleteDonorHandler = async (req: Request, res: Response) => {
  const { DonorId } = req.params;

  try {
    const deletedDonorCount = await Donor.destroy({
      where: { id: DonorId },
    });

    if (deletedDonorCount === 0) {
      return res.status(404).json({ message: "Donor not found" });
    }

    return res.status(200).json({ message: "Donor deleted successfully" });
  } catch (error) {
    console.error("Error deleting Donor:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
