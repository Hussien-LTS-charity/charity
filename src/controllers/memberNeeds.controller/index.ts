import { Request, Response } from "express";
import { MemberNeedsAttributes } from "../../config/types";
import FamilyMember from "../../models/FamilyMember";
import Family from "../../models/Family";
import MemberNeeds from "../../models/MemberNeeds";

export const httpAddMemberNeedsHandler = async (
  req: Request,
  res: Response
) => {
  try {

    const { familyId, familyMemberId } = req.params;

    const { id, needName, MemberPriority } = req.body;

    const parsedFamilyId = parseInt(familyId, 10);
    const parsedFamilyMemberId = parseInt(familyMemberId, 10);
    const family = await Family.findByPk(parsedFamilyId)

    if (!family) {

      return res.status(404).json({
        message: "Failed to retrieve Family"
      });
    }

    const familyMember = await FamilyMember.findByPk(parsedFamilyMemberId)
    if (!familyMember) {

      return res.status(404).json({
        message: "Failed to retrieve family Member"
      });
    }


    const newMemberNeedsData: MemberNeedsAttributes = {
      id,
      FamilyId: parsedFamilyId,
      familyMemberId: parsedFamilyMemberId,
      needName,
      MemberPriority,
    };

    const newMemberNeeds = await MemberNeeds.create(newMemberNeedsData);

    return res.status(201).json({
      message: "Member Need added successfully",
      memberNeeds: newMemberNeeds,
    });
  } catch (error) {
    console.error("Error adding Member Needs:", error);
    return res.status(500).json({ message: "Failed to add Member Needs" });
  }
};

export const httpGetSpecificMemberNeedsHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { familyId, familyMemberId } = req.params;
    const parsedFamilyId = parseInt(familyId, 10);
    const parsedFamilyMemberId = parseInt(familyMemberId, 10);
    const family = await Family.findByPk(parsedFamilyId)

    if (!family) {
      return res.status(404).json({
        message: "Failed to retrieve Family"
      });
    }
    const familyMember = await FamilyMember.findByPk(parsedFamilyMemberId)
    if (!familyMember) {
      return res.status(404).json({
        message: "Failed to retrieve family Member"
      });
    }

    const memberNeeds = await FamilyMember.findOne({
      where: {
        id: parsedFamilyMemberId,
        FamilyId: parsedFamilyId,
      },
      include: {
        model: MemberNeeds,
        as: "memberNeeds",
      },
    });
    if (!memberNeeds) {
      return res.status(404).json({ message: "member Needs not found" })
    } else {
      return res.status(200).json({ memberNeeds });
    }

  } catch (error) {
    console.error("Error retrieving member Needs:", error);
    return res.status(500).json({ message: "Failed to retrieve member Needs" });
  }
};

export const httpGetAllMembersNeedsHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { familyId } = req.params;
    const parsedFamilyId = parseInt(familyId, 10);
    const family = await Family.findByPk(parsedFamilyId);

    if (!family) {
      return res.status(500).json({ message: "Failed to retrieve family" });
    }
    const familyMembersNeeds = await FamilyMember.findAll({
      where: {
        FamilyId: parsedFamilyId,
      },
      include: {
        model: MemberNeeds,
        as: "memberNeeds",
      },
    });
    if (!familyMembersNeeds.length) {
      return res.status(404).json({ message: "There is no family members Needs" });
    } else {
      return res
        .status(200)
        .json({
          count: familyMembersNeeds.length,
          familyMembersNeeds
        });
    }
  } catch (error) {
    console.error("Error retrieving family members Needs:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve family members Needs" });
  }
};

export const httpEditMemberNeedsHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { familyId, familyMemberId } = req.params;

    const { id, needName, MemberPriority } = req.body;

    const parsedFamilyId = parseInt(familyId, 10);
    const parsedFamilyMemberId = parseInt(familyMemberId, 10);

    const updatedFamilyMemberNeedsData: MemberNeedsAttributes = {
      id,
      FamilyId: parsedFamilyId,
      familyMemberId: parsedFamilyMemberId,
      needName,
      MemberPriority,
    };

    const [updatedRowsCount] = await MemberNeeds.update(
      updatedFamilyMemberNeedsData,
      {
        where: {
          id: familyMemberId,
          FamilyId: familyId,
        },
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "family member Needs not found" });
    }

    const updatedFamilyMemberNeeds = await FamilyMember.findOne({
      where: {
        id: familyMemberId,
        FamilyId: familyId,
      },
      include: {
        model: MemberNeeds,
        as: "MemberNeeds",
      },
    });

    return res.status(200).json({
      message: "Family member Needs updated successfully",
      familyMember: updatedFamilyMemberNeeds,
    });
  } catch (error) {
    console.error("Error editing family member Needs:", error);
    return res.status(500).json({ message: "Failed to edit family member Needs" });
  }
};

export const httpDeleteMemberNeedsHandler = async (
  req: Request,
  res: Response
) => {
  const { familyId, familyMemberId } = req.params;

  try {
    const deletedFamilyMemberNeedsCount = await MemberNeeds.destroy({
      where: {
        id: familyMemberId,
        FamilyId: familyId,
      },
    });

    if (!deletedFamilyMemberNeedsCount) {
      return res
        .status(200)
        .json({ message: "Family member Needs deleted successfully" });
    }
    return res.status(404).json({ message: "Family member Needs not found" });
  } catch (error) {
    console.error("Error deleting family member Needs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
