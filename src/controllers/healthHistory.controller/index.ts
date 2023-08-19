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
    const {
      id,
      disease: { diseaseName, medicineName },
    } = req.body;

    const parsedFamilyId = parseInt(familyId, 10);
    const parsedFamilyMemberId = parseInt(familyMemberId, 10);

    const newFamilyMemberHealthHistoryData: HealthHistoryAttributes = {
      id,
      FamilyId: parsedFamilyId,
      familyMemberId: parsedFamilyMemberId,
      disease: { diseaseName, medicineName },
    };

    const newFamilyMemberHealthHistory = await HealthHistory.create(
      newFamilyMemberHealthHistoryData
    );

    res.status(201).json({
      message: "Family Member Health History added successfully",
      family: newFamilyMemberHealthHistory,
    });
  } catch (error) {
    console.error("Error adding Family Member Health History:", error);
    res.status(500).json({ message: "Failed to add family Health History" });
  }
};

export const httpGetSpecificFamilyMemberHealthHistoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { familyId, familyMemberId } = req.params;

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
      ?
      res
        .status(404)
        .json({ message: "family member health history not found" })
      :
      res.status(200).json({ familyMemberHealthHistory });
  } catch (error) {
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
    const { familyId, familyMemberId } = req.params;

    const {
      id,

      disease: { diseaseName, medicineName },
    } = req.body;

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
      res
        .status(404)
        .json({ message: "family member health history not found" });
    }

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

    res.status(200).json({
      message: "Family member health history updated successfully",
      familyMember: updatedFamilyMemberHealthHistory,
    });
  } catch (error) {
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
