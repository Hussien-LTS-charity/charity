import { Request, Response } from "express";
import { DonorAttributes } from "../../config/types";
import Donor from "../../models/Donor";

export const httpAddDonorHandler = async (req: Request, res: Response) => {
  try {
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

    return res
      .status(201)
      .json({ message: "Donor added successfully", Donor: newDonor });
  } catch (error) {
    console.log("Error adding Donor:", error);
    return res.status(500).json({ message: "Failed to add Donor" });
  }
};

export const httpGetDonorHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { donorId } = req.params;
    const parsedDonorId = parseInt(donorId, 10);
    const donor = await Donor.findByPk(parsedDonorId, {});

    !donor
      ? res.status(404).json({ message: "Donor not found" })
      : res.status(200).json({ donor });
  } catch (error) {
    console.log("Error retrieving Donor:", error);
    res.status(500).json({ message: "Failed to retrieve Donor" });
  }
};

export const httpGetAllDonorsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const donors = await Donor.findAll();

    res.status(200).json({ count: donors.length, donors });
  } catch (error) {
    console.log("Error retrieving Donors:", error);
    res.status(500).json({ message: "Failed to retrieve Donors" });
  }
};

export const httpEditDonorHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { donorId } = req.params;

    const parsedDonorId = parseInt(donorId, 10);

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
      where: { id: parsedDonorId },
    });

    if (updatedRowsCount === 0) {
      res.status(404).json({ message: "Donor not found" });
      return;
    }

    const updatedDonor = await Donor.findByPk(parsedDonorId);

    res
      .status(200)
      .json({ message: "Donor updated successfully", donor: updatedDonor });
  } catch (error) {
    console.log("Error editing Donor:", error);
    res.status(500).json({ message: "Failed to edit Donor" });
  }
};

//TODO:prevent the delete Donor member if there is any donations
export const httpDeleteDonorHandler = async (req: Request, res: Response) => {
  const { donorId } = req.params;
  const parsedDonorId = parseInt(donorId, 10);

  try {
    const deletedDonorCount = await Donor.destroy({
      where: { id: parsedDonorId },
    });

    if (deletedDonorCount === 0) {
      return res.status(404).json({ message: "Donor not found" });
    }

    return res.status(200).json({ message: "Donor deleted successfully" });
  } catch (error) {
    console.log("Error deleting Donor:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
