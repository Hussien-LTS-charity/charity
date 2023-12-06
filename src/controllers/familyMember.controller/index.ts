import { Request, Response } from "express";
import { FamilyMemberAttributes } from "../../config/types";
import FamilyMember from "../../models/FamilyMember";
import Family from "../../models/Family";

export const httpAddFamilyMemberHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { familyId } = req.params;
    const parsedFamilyId = parseInt(familyId, 10);
    const family = await Family.findByPk(parsedFamilyId);
    if (!family) {
      return res.status(404).json({
        message: "Failed to retrieve Family",
      });
    }

    const {
      id,
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

    const newFamilyMemberData: FamilyMemberAttributes = {
      id,
      FamilyId: parsedFamilyId,
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
    const newFamilyMember = await FamilyMember.create(newFamilyMemberData, {});

    return res.status(201).json({
      message: "Family Member added successfully",
      FamilyMember: newFamilyMember,
    });
  } catch (error) {
    // Handle any errors
    console.log("Error adding Family Member:", error);
    return res.status(500).json({ message: "Failed to add Family Member" });
  }
};

export const httpGetSpecificFamilyMemberHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { familyId, familyMemberId } = req.params;
    const parsedFamilyId = parseInt(familyId, 10);
    const parsedFamilyMemberId = parseInt(familyMemberId, 10);
    const familyMember = await FamilyMember.findOne({
      where: {
        id: parsedFamilyMemberId,
        FamilyId: parsedFamilyId,
      },
    });

    if (!familyMember) {
      return res.status(404).json({ message: "family member not found" });
    } else {
      return res.status(200).json({ familyMember });
    }
  } catch (error) {
    console.log("Error retrieving family member:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve family member" });
  }
};

export const httpGetAllFamilyMembersHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { familyId } = req.params;
    const parsedFamilyId = parseInt(familyId, 10);
    const family = await Family.findByPk(parsedFamilyId);

    if (!family) {
      return res.status(404).json({ message: "Failed to retrieve family" });
    }
    const familyMembers = await FamilyMember.findAll({
      where: {
        FamilyId: parsedFamilyId,
      },
    });
    if (!familyMembers.length) {
      return res.status(404).json({
        count: familyMembers.length,
        message: "There is no family members",
      });
    } else {
      return res
        .status(200)
        .json({ count: familyMembers.length, familyMembers });
    }
  } catch (error) {
    // Handle any errors
    console.log("Error retrieving family members:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve family members" });
  }
};

export const httpEditFamilyMemberHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { familyId, familyMemberId } = req.params;
    const parsedFamilyId = parseInt(familyId, 10);
    const parsedFamilyMemberId = parseInt(familyMemberId, 10);
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
          id: parsedFamilyMemberId,
          FamilyId: parsedFamilyId,
        },
      }
    );

    if (updatedRowsCount === 0) {
      return res
        .status(200)
        .json({ message: "There are No Records Were Updated" });
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
    console.log("Error editing family member:", error);
    return res.status(500).json({ message: "Failed to edit family member" });
  }
};

export const httpDeleteFamilyMemberHandler = async (
  req: Request,
  res: Response
) => {
  const { familyId, familyMemberId } = req.params;
  const parsedFamilyId = parseInt(familyId);
  const parsedFamilyMemberId = parseInt(familyMemberId);
  try {
    const familyMemberData = await FamilyMember.findOne({
      where: {
        id: parsedFamilyMemberId,
        FamilyId: parsedFamilyId,
      },
    });
    const isPersonOnCharge = familyMemberData?.isPersonCharge;
    if (isPersonOnCharge) {
      return res.status(403).json({
        message:
          "Family member can not be deleted you should delete the whole family",
      });
    } else {
      const deletedFamilyMemberCount = await FamilyMember.destroy({
        where: {
          id: parsedFamilyMemberId,
          FamilyId: parsedFamilyId,
        },
      });

      if (deletedFamilyMemberCount === 0) {
        return res.status(404).json({ message: "Family member not found" });
      }
      return res
        .status(200)
        .json({ message: "Family member deleted successfully" });
    }
  } catch (error) {
    console.log("Error deleting family member:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
