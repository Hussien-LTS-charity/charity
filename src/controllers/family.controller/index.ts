import { Request, Response } from "express";
import { FamilyAttributes } from "../../config/types";
import Family from "../../models/Family";
import FamilyMember from "../../models/FamilyMember";

export const httpAddFamilyHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract the family data from the request body
    const {
      id,
      personCharge,
      email,
      address,
      contactNumber,
      houseCondition,
      notes,
      familyCategory,
      members,
    } = req.body;

    // Create a new family instance
    const newFamilyData: FamilyAttributes = {
      id,
      personCharge,
      email,
      address,
      contactNumber,
      houseCondition,
      notes,
      familyCategory,
    };
    const newFamily = await Family.create(newFamilyData);

    // Add the family members
    await Promise.all(
      members.map(async (member: FamilyMember) => {
        const {
          firstName,
          lastName,
          gender,
          maritalStatus,
          address,
          email,
          dateOfBirth,
          phoneNumber,
          isWorking,
          proficient,
          totalIncome,
          educationLevel,
        } = member;

        // Create a new family member instance and associate it with the family
        const newMemberData = {
          id,
          FamilyId: newFamily.id,
          firstName,
          lastName,
          gender,
          maritalStatus,
          address,
          email,
          dateOfBirth,
          phoneNumber,
          isWorking,
          proficient,
          totalIncome,
          educationLevel,
        };
        await FamilyMember.create(newMemberData);
      })
    );

    // Send a success response
    res
      .status(201)
      .json({ message: "Family added successfully", family: newFamily });
  } catch (error) {
    // Handle any errors
    console.error("Error adding family:", error);
    res.status(500).json({ message: "Failed to add family" });
  }
};

export const httpGetFamilyHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract the family ID from the request parameters
    const { familyId } = req.params;

    // Find the family by ID
    const family = await Family.findByPk(familyId);

    !family
      ? // If family is not found, send a not found response
        res.status(404).json({ message: "Family not found" })
      : // If family is found, send the family object in the response
        res.status(200).json({ family });
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving family:", error);
    res.status(500).json({ message: "Failed to retrieve family" });
  }
};

export const httpGetAllFamiliesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Retrieve all families from the database
    const families = await Family.findAll();

    // Send the families array in the response
    res.status(200).json({ families });
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving families:", error);
    res.status(500).json({ message: "Failed to retrieve families" });
  }
};

export const httpEditFamilyHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract the family ID from the request parameters
    const { familyId } = req.params;

    // Update the family attributes
    const {
      id,
      personCharge,
      email,
      address,
      contactNumber,
      houseCondition,
      notes,
      familyCategory,
    } = req.body;

    const updatedFamilyData: FamilyAttributes = {
      id,
      personCharge,
      email,
      address,
      contactNumber,
      houseCondition,
      notes,
      familyCategory,
    };

    const [updatedRowsCount] = await Family.update(updatedFamilyData, {
      where: { id: familyId },
    });

    if (updatedRowsCount === 0) {
      // If no rows were updated, send a not found response
      res.status(404).json({ message: "Family not found" });
      return;
    }

    // Find the updated family by ID
    const updatedFamily = await Family.findByPk(familyId);

    // Send a success response
    res
      .status(200)
      .json({ message: "Family updated successfully", family: updatedFamily });
  } catch (error) {
    // Handle any errors
    console.error("Error editing family:", error);
    res.status(500).json({ message: "Failed to edit family" });
  }
};

export const httpDeleteFamilyHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedFamilyCount = await Family.destroy({
      where: { id },
    });

    if (deletedFamilyCount === 0) {
      return res.status(404).json({ message: "Family not found" });
    }

    return res.status(200).json({ message: "Family deleted successfully" });
  } catch (error) {
    console.error("Error deleting family:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
