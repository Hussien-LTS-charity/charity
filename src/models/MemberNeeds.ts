import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
interface MemberNeedsAttributes {
  id: number;
  needName: string;
}
class MemberNeeds
  extends Model<MemberNeedsAttributes>
  implements MemberNeedsAttributes
{
  id!: number;
  needName!: string;
}

MemberNeeds.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    needName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "MemberNeeds",
  }
);

export default MemberNeeds;
