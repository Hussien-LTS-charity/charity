import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import { HealthHistoryAttributes } from "../config/types";

class HealthHistory
  extends Model<HealthHistoryAttributes>
  implements HealthHistoryAttributes
{
  id!: number;
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
    familyMemberId: {
      type: DataTypes.INTEGER,
    },
    disease: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    sequelize,
    modelName: "healthHistory",
  }
);

export default HealthHistory;
