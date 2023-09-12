import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import { HealthHistoryAttributes } from "../config/types";

class HealthHistory
  extends Model<HealthHistoryAttributes>
  implements HealthHistoryAttributes
{
  id!: number;
  FamilyId!: number;
  familyMemberId!: number;
  disease!: {
    diseaseName: string;
    medicineName: string;
  };
}
HealthHistory.init(
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
    disease: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
    sequelize,
    modelName: "healthHistory",
  }
);

export default HealthHistory;
