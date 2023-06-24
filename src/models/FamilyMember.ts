import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import MemberNeeds from "./MemberNeeds";
import HealthHistory from "./HealthHistory";

enum Gender {
  Male = "male",
  Female = "female",
}
enum MaritalStatus {
  Single = "Single",
  Married = "Married",
  Divorced = "Divorced",
  Widowed = "Widowed",
}

interface FamilyMemberAttributes {
  id: number;
  firstName: string;
  lastName: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  address: string;
  email: string;
  dateOfBirth: Date;
  phoneNumber: string;
  isWorking: boolean;
  proficient: string;
  totalIncome: number;
  educationLevel: number;
}

class FamilyMember
  extends Model<FamilyMemberAttributes>
  implements FamilyMemberAttributes
{
  id!: number;
  firstName!: string;
  lastName!: string;
  gender!: Gender;
  maritalStatus!: MaritalStatus;
  address!: string;
  email!: string;
  dateOfBirth!: Date;
  phoneNumber!: string;
  isWorking!: boolean;
  proficient!: string;
  totalIncome!: number;
  educationLevel!: number;
}
FamilyMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM(...Object.values(Gender)),
      allowNull: false,
      defaultValue: Gender.Male,
    },
    maritalStatus: {
      type: DataTypes.ENUM(...Object.values(MaritalStatus)),
      allowNull: false,
      defaultValue: MaritalStatus.Single,
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
    dateOfBirth: {
      type: DataTypes.DATE, // Use DataTypes.DATEONLY for date-only values
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: "Invalid date of birth",
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [10, 15],
          msg: "Phone number must be between 10 and 15 digits",
        },
      },
    },
    isWorking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    proficient: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalIncome: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    educationLevel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "FamilyMember",
  }
);

FamilyMember.hasMany(MemberNeeds, {
  foreignKey: "familyMemberId",
  as: "memberNeeds",
});

MemberNeeds.belongsTo(FamilyMember, {
  foreignKey: "familyMemberId",
  as: "familyMember",
});

FamilyMember.hasMany(HealthHistory, {
  foreignKey: "familyMemberId",
  as: "needs",
});

MemberNeeds.belongsTo(HealthHistory, {
  foreignKey: "familyMemberId",
  as: "healthHistory",
});

export default FamilyMember;
