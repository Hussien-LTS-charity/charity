import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import FamilyMember from "./FamilyMember";
import { FamilyAttributes } from "../config/types";
import { FamilyCategory, Priority } from "../config/enums";
import HealthHistory from "./HealthHistory";
import MemberNeeds from "./MemberNeeds";

class Family extends Model<FamilyAttributes> implements FamilyAttributes {
  id!: number;
  // DonationId!: number;
  personCharge!: string;
  email!: string;
  address!: string;
  contactNumber!: string;
  houseCondition!: string;
  notes!: string;
  familyCategory!: FamilyCategory;
  familyPriority!: Priority;
}

Family.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    personCharge: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: {
          msg: "Invalid email address",
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
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
      allowNull: true,
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
    },
    familyCategory: {
      type: DataTypes.ENUM(...Object.values(FamilyCategory)),
      allowNull: false,
    },
    familyPriority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
  },
  { sequelize, modelName: "Family" }
);

Family.hasMany(FamilyMember, {
  foreignKey: "FamilyId",
  as: "FamilyMember",
});

FamilyMember.belongsTo(Family, {
  foreignKey: "FamilyId",
  as: "Family",
});

Family.hasMany(HealthHistory, {
  foreignKey: "FamilyId",
  as: "HealthHistory",
});

HealthHistory.belongsTo(Family, {
  foreignKey: "FamilyId",
  as: "Family",
});

Family.hasMany(MemberNeeds, {
  foreignKey: "FamilyId",
  as: "MemberNeeds",
});

MemberNeeds.belongsTo(Family, {
  foreignKey: "FamilyId",
  as: "Family",
});
export default Family;
