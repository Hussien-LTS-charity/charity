import { Request, Response } from "express";
import { MemberNeedsAttributes } from "../../config/types";
import FamilyMember from "../../models/FamilyMember";
import Family from "../../models/Family";
import MemberNeeds from "../../models/MemberNeeds";

export const httpAddMemberNeedsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { familyId, familyMemberId } = req.params;

    // Extract the Member Needs data from the request body
    const { id, needName, MemberPriority } = req.body;

    // Convert the id to a number
    const parsedFamilyId = parseInt(familyId, 10);
    const parsedFamilyMemberId = parseInt(familyMemberId, 10);

    // Create a new Family Member instance
    const newMemberNeedsData: MemberNeedsAttributes = {
      id,
      FamilyId: parsedFamilyId,
      familyMemberId: parsedFamilyMemberId,
      needName,
      MemberPriority,
    };

    const newMemberNeeds = await MemberNeeds.create(newMemberNeedsData);

    // Send a success response
    res.status(201).json({
      message: "Member Needs added successfully",
      memberNeeds: newMemberNeeds,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error adding Member Needs:", error);
    res.status(500).json({ message: "Failed to add Member Needs" });
  }
};

export const httpGetSpecificMemberNeedsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract the IDs from the request parameters
    const { familyId, familyMemberId } = req.params;

    // Find the Member Needs by IDs
    const memberNeeds = await FamilyMember.findOne({
      where: {
        id: familyMemberId,
        FamilyId: familyId,
      },
      include: {
        model: MemberNeeds,
        as: "MemberNeeds",
      },
    });

    !memberNeeds
      ? // If member Needs is not found, send a not found response
        res.status(404).json({ message: "member Needs not found" })
      : // If member Needs is found, send the family member object in the response
        res.status(200).json({ memberNeeds });
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving member Needs:", error);
    res.status(500).json({ message: "Failed to retrieve memberNeeds" });
  }
};

export const httpGetAllMembersNeedsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { familyId } = req.params;
    const family = await Family.findByPk(familyId);

    if (!family) {
      res.status(500).json({ message: "Failed to retrieve family" });
    }
    const familyMembersNeeds = await FamilyMember.findAll({
      where: {
        FamilyId: familyId,
      },
      include: {
        model: MemberNeeds,
        as: "MemberNeeds",
      },
    });
    if (!familyMembersNeeds.length) {
      res.status(404).json({ message: "There is no family members Needs" });
      return;
    } else {
      res
        .status(200)
        .json({ count: familyMembersNeeds.length, familyMembersNeeds });
    }
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving family members Needs:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve family members Needs" });
  }
};

export const httpEditMemberNeedsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract the IDs from the request parameters
    const { familyId, familyMemberId } = req.params;

    // Update the family member Needs attributes
    const { id, needName, MemberPriority } = req.body;

    // Convert the id to a number
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
      // If no rows were updated, send a not found response
      res.status(404).json({ message: "family member Needs not found" });
    }

    // Find the updated family member Needs by ID
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

    // Send a success response
    res.status(200).json({
      message: "Family member Needs updated successfully",
      familyMember: updatedFamilyMemberNeeds,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error editing family member Needs:", error);
    res.status(500).json({ message: "Failed to edit family member Needs" });
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
