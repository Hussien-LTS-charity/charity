import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import FamilyMember from "./FamilyMember";
import { FamilyAttributes } from "../config/types";
import { FamilyCategory } from "../config/enums";

class Family extends Model<FamilyAttributes> implements FamilyAttributes {
  id!: number;
  personCharge!: string;
  email!: string;
  address!: string;
  contactNumber!: string;
  houseCondition!: string;
  notes!: string;
  familyCategory!: FamilyCategory;
}

Family.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    personCharge: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Invalid email address",
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Address cannot be empty",
        },
        len: {
          args: [5, 100],
          msg: "Address must be between 5 and 100 characters",
        },
      },
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [10, 15],
          msg: "Phone number must be between 10 and 15 digits",
        },
      },
    },
    houseCondition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    familyCategory: {
      type: DataTypes.ENUM(...Object.values(FamilyCategory)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Family",
  }
);

Family.hasMany(FamilyMember, {
  foreignKey: "FamilyId",
  as: "FamilyMember",
});

FamilyMember.belongsTo(Family, {
  foreignKey: "FamilyId",
  as: "Family",
});

export default Family;
