//TODO: GET RED OF THE ID
import { Request, Response } from "express";
import { FamilyAttributes } from "../../config/types";
import Family from "../../models/Family";
import FamilyMember from "../../models/FamilyMember";

export const httpAddFamilyHandler = async (req: Request, res: Response) => {
  try {
    const {
      id,
      personCharge,
      familyPriority,
      email,
      address,
      contactNumber,
      houseCondition,
      notes,
      familyCategory,
      members,
    } = req.body;

    const newFamilyData: FamilyAttributes = {
      id,
      personCharge,
      familyPriority,
      email,
      address,
      contactNumber,
      houseCondition,
      notes,
      familyCategory,
    };

    if (members?.length > 0) {
      const newFamily = await Family.create(newFamilyData);
      try {
        await Promise.all(
          members.map(async (member: FamilyMember) => {
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
            } = member;

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
              isPersonCharge,
              proficient,
              totalIncome,
              educationLevel,
            };
            await FamilyMember.create(newMemberData);
            if (member.isPersonCharge) {
              const personCharge = `${member.firstName} ${member.lastName}`;
              await newFamily.update({
                personCharge: personCharge,
              });
            }
          })
        );

        const newFamilyWithMembers = await Family.findOne({
          where: {
            id: newFamily.id,
          },
          include: {
            model: FamilyMember,
            as: "FamilyMember",
          },
          attributes: { exclude: ["createdAt", "updatedAt"] },
        });
        return res.status(201).json({
          message: "Family and Family Members added successfully",
          family: newFamilyWithMembers,
        });
      } catch (error) {
        console.log("Error adding family Member:", error);
        return res
          .status(500)
          .json({ message: "Failed to add family with members" });
      }
    } else {
      return res
        .status(403)
        .json({ message: "Should Have at Least One Family Member" });
    }
  } catch (error) {
    console.log("Error adding family:", error);
    return res
      .status(500)
      .json({ message: "Failed to add family without members" });
  }
};

export const httpGetFamilyHandler = async (req: Request, res: Response) => {
  try {
    const { familyId } = req.params;
    const parsedFamilyId = parseInt(familyId, 10);

    const family = await Family.findByPk(parsedFamilyId, {
      include: {
        model: FamilyMember,
        as: "FamilyMember",
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    } else {
      return res.status(200).json({ family });
    }
  } catch (error) {
    console.log("Error retrieving family:", error);
    return res.status(500).json({ message: "Failed to retrieve family" });
  }
};

export const httpGetAllFamiliesHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const families = await Family.findAll();
    if (families.length === 0) {
      return res.status(404).json({ message: "There are no families" });
    } else {
      return res.status(200).json({ count: families.length, families });
    }
  } catch (error) {
    console.log("Error retrieving families:", error);
    return res.status(500).json({ message: "Failed to retrieve families" });
  }
};

export const httpEditFamilyHandler = async (req: Request, res: Response) => {
  try {
    const { familyId } = req.params;
    const parsedFamilyId = parseInt(familyId, 10);

    const {
      id,
      personCharge,
      familyPriority,
      email,
      address,
      contactNumber,
      houseCondition,
      notes,
      familyCategory,
    } = req.body;

    const updatedFamilyData: FamilyAttributes = {
      id,
      familyPriority,
      personCharge,
      email,
      address,
      contactNumber,
      houseCondition,
      notes,
      familyCategory,
    };

    const [updatedRowsCount] = await Family.update(updatedFamilyData, {
      where: { id: parsedFamilyId },
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "Family not found" });
    }

    const updatedFamily = await Family.findByPk(parsedFamilyId);

    res
      .status(200)
      .json({ message: "Family updated successfully", family: updatedFamily });
  } catch (error) {
    console.log("Error editing family:", error);
    return res.status(500).json({ message: "Failed to edit family" });
  }
};

//TODO:prevent the delete family member if there is any Family Member
export const httpDeleteFamilyHandler = async (req: Request, res: Response) => {
  try {
    const { familyId } = req.params;
    const parsedFamilyId = parseInt(familyId, 10);

    const deletedFamilyCount = await Family.destroy({
      where: { id: parsedFamilyId },
    });

    if (deletedFamilyCount === 0) {
      return res.status(404).json({ message: "Family not found" });
    }

    return res.status(200).json({ message: "Family deleted successfully" });
  } catch (error) {
    console.log("Error deleting family:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
