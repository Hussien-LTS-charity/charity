import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import { MemberNeedsAttributes } from "../config/types";
import { Priority } from "../config/enums";

class MemberNeeds
  extends Model<MemberNeedsAttributes>
  implements MemberNeedsAttributes
{
  id!: number;
  FamilyId!: number;
  familyMemberId!: number;
  needName!: string;
  MemberPriority!: Priority;
}

MemberNeeds.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    FamilyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    familyMemberId: {
      type: DataTypes.INTEGER,
    },
    needName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    MemberPriority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
  },
  {
    sequelize,
    modelName: "MemberNeeds",
  }
);

export default MemberNeeds;
