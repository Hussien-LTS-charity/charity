import { Request, Response } from "express";
import { FamilyMemberAttributes } from "../../config/types";
import FamilyMember from "../../models/FamilyMember";
import Family from "../../models/Family";

export const httpAddFamilyMemberHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { familyId } = req.params
    const family = await Family.findByPk(familyId)
    if (!family) {

      return res.status(404).json({
        message: "Failed to retrieve Family"
      });
    }
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
    return res.status(201).json({
      message: "Family Member added successfully",
      FamilyMember: newFamilyMember,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error adding Family Member:", error);
    return res.status(500).json({ message: "Failed to add Family Member" });
  }
};

export const httpGetSpecificFamilyMemberHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { familyId, familyMemberId } = req.params;

    const familyMember = await FamilyMember.findOne({
      where: {
        id: familyMemberId,
        FamilyId: familyId,
      },
    });

    if (!familyMember) {
      return res.status(404).json({ message: "family member not found" })
    } else {
      return res.status(200).json({ familyMember });
    }



  } catch (error) {
    console.error("Error retrieving family member:", error);
    return res.status(500).json({ message: "Failed to retrieve family member" });
  }
};

export const httpGetAllFamilyMembersHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { familyId } = req.params;
    const family = await Family.findByPk(parseInt(familyId));

    if (!family) {
      return res.status(404).json({ message: "Failed to retrieve family" });
    }
    const familyMembers = await FamilyMember.findAll({
      where: {
        FamilyId: parseInt(familyId),
      },
    });
    if (!familyMembers.length) {
      return res.status(404).json({ count: familyMembers.length, message: "There is no family members" });
    } else {
      return res.status(200).json({ count: familyMembers.length, familyMembers });
    }
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving family members:", error);
    return res.status(500).json({ message: "Failed to retrieve family members" });
  }
};

export const httpEditFamilyMemberHandler = async (
  req: Request,
  res: Response
) => {
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
      return res.status(404).json({ message: "Family member not found" });
    }

    const updatedFamilyMember = await FamilyMember.findOne({
      where: {
        id: familyMemberId,
        FamilyId: familyId,
      },
    });

    return res.status(200).json({
      message: "Family member updated successfully",
      familyMember: updatedFamilyMember,
    });
  } catch (error) {
    console.error("Error editing family member:", error);
    return res.status(500).json({ message: "Failed to edit family member" });
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
