import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";

interface HealthHistoryAttributes {
  id: number;
  disease: {
    diseaseName: string;
    medicineName: string;
  };
}

class HealthHistory
  extends Model<HealthHistoryAttributes>
  implements HealthHistoryAttributes
{
  id!: number;
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
