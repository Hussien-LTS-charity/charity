import { Request, Response } from "express";
import { FamilyMemberAttributes } from "../../config/types";
import FamilyMember from "../../models/FamilyMember";
import Family from "../../models/Family";

export const httpAddFamilyMemberHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract the Family Member data from the request body
    const {
      id,
      FamilyId,
      firstName,
      lastName,
      gender,
      maritalStatus,
      address,
      email,
      dateOfBirth,
      phoneNumber,
      isWorking,
      isPersonCharge,
      proficient,
      totalIncome,
      educationLevel,
    } = req.body;

    // Create a new Family Member instance
    const newFamilyMemberData: FamilyMemberAttributes = {
      id,
      FamilyId,
      firstName,
      lastName,
      gender,
      maritalStatus,
      address,
      email,
      dateOfBirth,
      phoneNumber,
      isWorking,
      isPersonCharge,
      proficient,
      totalIncome,
      educationLevel,
    };
    const newFamilyMember = await FamilyMember.create(newFamilyMemberData);
    // Send a success response
    res.status(201).json({
      message: "Family Member added successfully",
      family: newFamilyMember,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error adding family:", error);
    res.status(500).json({ message: "Failed to add family" });
  }
};

export const httpGetSpecificFamilyMemberHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract the family member ID from the request parameters
    const { familyId, familyMemberId } = req.params;

    // Find the family by ID
    const familyMember = await FamilyMember.findOne({
      where: {
        id: familyMemberId,
        FamilyId: familyId,
      },
    });

    !familyMember
      ? // If family member is not found, send a not found response
        res.status(404).json({ message: "family member not found" })
      : // If family member is found, send the family member object in the response
        res.status(200).json({ familyMember });
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving family member:", error);
    res.status(500).json({ message: "Failed to retrieve family member" });
  }
};

export const httpGetAllFamilyMembersHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { familyId } = req.params;
    const family = await Family.findByPk(familyId);

    if (!family) {
      res.status(500).json({ message: "Failed to retrieve families" });
    }
    const familyMembers = await FamilyMember.findAll({
      where: {
        FamilyId: familyId,
      },
    });
    if (!familyMembers.length) {
      res.status(404).json({ message: "There is no family members" });
      return;
    } else {
      res.status(200).json({ count: familyMembers.length, familyMembers });
    }
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving family members:", error);
    res.status(500).json({ message: "Failed to retrieve family members" });
  }
};

export const httpEditFamilyMemberHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract the family member ID from the request parameters
    const { familyId, familyMemberId } = req.params;

    // Update the family member attributes
    const {
      id,
      FamilyId,
      firstName,
      lastName,
      gender,
      maritalStatus,
      address,
      email,
      dateOfBirth,
      phoneNumber,
      isWorking,
      isPersonCharge,
      proficient,
      totalIncome,
      educationLevel,
    } = req.body;

    const updatedFamilyMemberData: FamilyMemberAttributes = {
      id,
      FamilyId,
      firstName,
      lastName,
      gender,
      maritalStatus,
      address,
      email,
      dateOfBirth,
      phoneNumber,
      isWorking,
      isPersonCharge,
      proficient,
      totalIncome,
      educationLevel,
    };

    const [updatedRowsCount] = await FamilyMember.update(
      updatedFamilyMemberData,
      {
        where: {
          id: familyMemberId,
          FamilyId: familyId,
        },
      }
    );

    if (updatedRowsCount === 0) {
      // If no rows were updated, send a not found response
      res.status(404).json({ message: "Family member not found" });
    }

    // Find the updated family member by ID
    const updatedFamilyMember = await FamilyMember.findOne({
      where: {
        id: familyMemberId,
        FamilyId: familyId,
      },
    });

    // Send a success response
    res.status(200).json({
      message: "Family member updated successfully",
      familyMember: updatedFamilyMember,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Failed to edit family member" });
    console.error("Error editing family member:", error);
  }
};

export const httpDeleteFamilyMemberHandler = async (
  req: Request,
  res: Response
) => {
  const { familyId, familyMemberId } = req.params;

  try {
    const deletedFamilyMemberCount = await FamilyMember.destroy({
      where: {
        id: familyMemberId,
        FamilyId: familyId,
      },
    });

    if (!deletedFamilyMemberCount) {
      return res
        .status(200)
        .json({ message: "Family member deleted successfully" });
    }
    return res.status(404).json({ message: "Family member not found" });
  } catch (error) {
    console.error("Error deleting family member:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
