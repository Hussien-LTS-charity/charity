import { Request, Response } from "express";
import { HealthHistoryAttributes } from "../../config/types";
import FamilyMember from "../../models/FamilyMember";
import Family from "../../models/Family";
import HealthHistory from "../../models/HealthHistory";

export const httpAddFamilyMemberHealthHistoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { familyId, familyMemberId } = req.params;
    // Extract the Family Member Health History data from the request body
    const {
      id,
      disease: { diseaseName, medicineName },
    } = req.body;

    // Convert the id to a number
    const parsedFamilyId = parseInt(familyId, 10);
    const parsedFamilyMemberId = parseInt(familyMemberId, 10);

    // Create a new Family Member instance
    const newFamilyMemberHealthHistoryData: HealthHistoryAttributes = {
      id,
      FamilyId: parsedFamilyId,
      familyMemberId: parsedFamilyMemberId,
      disease: { diseaseName, medicineName },
    };

    const newFamilyMemberHealthHistory = await HealthHistory.create(
      newFamilyMemberHealthHistoryData
    );

    // Send a success response
    res.status(201).json({
      message: "Family Member Health History added successfully",
      family: newFamilyMemberHealthHistory,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error adding Family Member Health History:", error);
    res.status(500).json({ message: "Failed to add family Health History" });
  }
};

export const httpGetSpecificFamilyMemberHealthHistoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract the family member health history ID from the request parameters
    const { familyId, familyMemberId } = req.params;

    // Find the family by ID
    const familyMemberHealthHistory = await FamilyMember.findOne({
      where: {
        id: familyMemberId,
        FamilyId: familyId,
      },
      include: {
        model: HealthHistory,
        as: "HealthHistory",
      },
    });

    !familyMemberHealthHistory
      ? // If family member health history is not found, send a not found response
        res
          .status(404)
          .json({ message: "family member health history not found" })
      : // If family member health history is found, send the family member object in the response
        res.status(200).json({ familyMemberHealthHistory });
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving family member health history:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve family member health history" });
  }
};

export const httpGetAllFamilyMembersHealthHistoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { familyId } = req.params;
    const family = await Family.findByPk(familyId);

    if (!family) {
      res.status(500).json({ message: "Failed to retrieve family" });
    }
    const familyMembers = await FamilyMember.findAll({
      where: {
        FamilyId: familyId,
      },
      include: {
        model: HealthHistory,
        as: "HealthHistory",
      },
    });
    if (!familyMembers.length) {
      res
        .status(404)
        .json({ message: "There is no family members health history" });
      return;
    } else {
      res.status(200).json({ count: familyMembers.length, familyMembers });
    }
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving family members health history:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve family members health history" });
  }
};

export const httpEditFamilyMemberHealthHistoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract the IDs from the request parameters
    const { familyId, familyMemberId } = req.params;

    // Update the family member health history attributes
    const {
      id,

      disease: { diseaseName, medicineName },
    } = req.body;

    // Convert the id to a number
    const parsedFamilyId = parseInt(familyId, 10);
    const parsedFamilyMemberId = parseInt(familyMemberId, 10);

    const updatedFamilyMemberHealthHistoryData: HealthHistoryAttributes = {
      id,
      FamilyId: parsedFamilyId,
      familyMemberId: parsedFamilyMemberId,
      disease: { diseaseName, medicineName },
    };

    const [updatedRowsCount] = await HealthHistory.update(
      updatedFamilyMemberHealthHistoryData,
      {
        where: {
          id: familyMemberId,
          FamilyId: familyId,
        },
      }
    );

    if (updatedRowsCount === 0) {
      // If no rows were updated, send a not found response
      res
        .status(404)
        .json({ message: "family member health history not found" });
    }

    // Find the updated family member health history by ID
    const updatedFamilyMemberHealthHistory = await FamilyMember.findOne({
      where: {
        id: familyMemberId,
        FamilyId: familyId,
      },
      include: {
        model: HealthHistory,
        as: "HealthHistory",
      },
    });

    // Send a success response
    res.status(200).json({
      message: "Family member health history updated successfully",
      familyMember: updatedFamilyMemberHealthHistory,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error editing family member health history:", error);
    res
      .status(500)
      .json({ message: "Failed to edit family member health history" });
  }
};

export const httpDeleteFamilyMemberHealthHistoryHandler = async (
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
        .json({ message: "Family member health history deleted successfully" });
    }
    return res
      .status(404)
      .json({ message: "Family member health history not found" });
  } catch (error) {
    console.error("Error deleting family member health history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
