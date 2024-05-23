import { Request, Response } from "express";
import { HealthHistoryAttributes } from "../../config/types";
import FamilyMember from "../../models/FamilyMember";
import Family from "../../models/Family";
import HealthHistory from "../../models/HealthHistory";

export const httpAddHealthHistoryHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { familyId, familyMemberId } = req.params;
    const { id, diseaseName, medicineName } = req.body;

    const parsedFamilyId = parseInt(familyId, 10);
    const parsedFamilyMemberId = parseInt(familyMemberId, 10);

    const family = await Family.findByPk(parsedFamilyId);
    if (!family) {
      return res.status(404).json({ message: "Failed to retrieve family" });
    }

    const familyMember = await FamilyMember.findByPk(parsedFamilyMemberId);
    if (!familyMember) {
      return res
        .status(404)
        .json({ message: "Failed to retrieve family Member" });
    }

    const newHealthHistoryData: HealthHistoryAttributes = {
      id,
      FamilyId: parsedFamilyId,
      familyMemberId: parsedFamilyMemberId,
      disease: { diseaseName, medicineName },
    };

    const newHealthHistory = await HealthHistory.create(newHealthHistoryData);

    return res.status(201).json({
      message: "Health History added successfully",
      healthHistory: newHealthHistory,
    });
  } catch (error) {
    console.log("Error adding Health History:", error);
    return res.status(500).json({ message: "Failed to add Health History" });
  }
};

export const httpGetSpecificHealthHistoryHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { familyId, familyMemberId } = req.params;
    const parsedFamilyId = parseInt(familyId, 10);
    const parsedFamilyMemberId = parseInt(familyMemberId, 10);

    const family = await Family.findByPk(parsedFamilyId);
    if (!family) {
      return res.status(404).json({ message: "Failed to retrieve family" });
    }

    const familyMember = await FamilyMember.findByPk(parsedFamilyMemberId);
    if (!familyMember) {
      return res
        .status(404)
        .json({ message: "Failed to retrieve family member" });
    }

    const healthHistory = await FamilyMember.findOne({
      where: {
        id: parsedFamilyMemberId,
        FamilyId: parsedFamilyId,
      },
      include: {
        model: HealthHistory,
        as: "healthHistory",
      },
    });
    if (!healthHistory) {
      return res.status(404).json({ message: "health history not found" });
    } else {
      return res.status(200).json({ healthHistory });
    }
  } catch (error) {
    console.log("Error retrieving health history:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve health history" });
  }
};

export const httpGetAllHealthHistoryHandler = async (
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
        FamilyId: familyId,
      },
      include: {
        model: HealthHistory,
        as: "healthHistory",
      },
    });
    if (!familyMembers.length) {
      return res.status(404).json({ message: "There is no health history" });
    } else {
      return res.status(200).json({
        count: familyMembers.length,
        familyMembersHealthHistory: familyMembers,
      });
    }
  } catch (error) {
    console.log("Error retrieving health history:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve health history" });
  }
};

export const httpEditHealthHistoryHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { familyId, familyMemberId, healthHistoryId } = req.params;
    const parsedHealthHistoryId = parseInt(healthHistoryId, 10);
    const parsedFamilyId = parseInt(familyId, 10);
    const parsedFamilyMemberId = parseInt(familyMemberId, 10);

    const { diseaseName, medicineName } = req.body;

    const family = await Family.findByPk(parsedFamilyId);
    if (!family) {
      return res.status(404).json({ message: "Failed to retrieve family" });
    }

    const familyMember = await FamilyMember.findByPk(parsedFamilyMemberId);
    if (!familyMember) {
      return res
        .status(404)
        .json({ message: "Failed to retrieve family member" });
    }

    const updatedHealthHistoryData: HealthHistoryAttributes = {
      id: parsedHealthHistoryId,
      FamilyId: parsedFamilyId,
      familyMemberId: parsedFamilyMemberId,
      disease: { diseaseName, medicineName },
    };

    const [updatedRowsCount] = await HealthHistory.update(
      updatedHealthHistoryData,
      {
        where: {
          id: parsedHealthHistoryId,
          FamilyId: parsedFamilyId,
          familyMemberId: parsedFamilyMemberId,
        },
      }
    );

    if (updatedRowsCount === 0) {
      return res
        .status(200)
        .json({ message: "There are No Records Were Updated" });
    }

    const updatedHealthHistory = await FamilyMember.findOne({
      where: {
        id: parsedFamilyMemberId,
        FamilyId: parsedFamilyId,
      },
      include: {
        model: HealthHistory,
        as: "healthHistory",
      },
    });

    return res.status(200).json({
      message: "health history updated successfully",
      familyMemberHealthHistory: updatedHealthHistory,
    });
  } catch (error) {
    console.log("Error editing health history:", error);
    return res.status(500).json({ message: "Failed to edit health history" });
  }
};

export const httpDeleteHealthHistoryHandler = async (
  req: Request,
  res: Response
) => {
  const { familyId, familyMemberId, healthHistoryId } = req.params;
  const parsedHealthHistoryId = parseInt(healthHistoryId, 10);
  const parsedFamilyId = parseInt(familyId, 10);
  const parsedFamilyMemberId = parseInt(familyMemberId, 10);

  try {
    const deletedHealthHistoryCount = await HealthHistory.destroy({
      where: {
        id: parsedHealthHistoryId,
        FamilyId: parsedFamilyId,
        familyMemberId: parsedFamilyMemberId,
      },
    });

    if (deletedHealthHistoryCount !== 0) {
      return res
        .status(200)
        .json({ message: "health history deleted successfully" });
    }
    return res.status(404).json({ message: "health history not found" });
  } catch (error) {
    console.log("Error deleting health history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
