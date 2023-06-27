import { DataTypes, Model } from "sequelize";
import { DonorAttributes } from "../config/types";
import sequelize from "./sequelize";
import { DonorCategory, Gender } from "../config/enums";
import Donation from "./Donation";

class Donor extends Model<DonorAttributes> implements DonorAttributes {
  idCopy!: string;
  nationalNumber!: number;
  firstName!: string;
  lastName!: string;
  gender!: Gender;
  email!: string;
  bankAccountNumber!: number;
  address!: string;
  phoneNumber!: string;
  dateOfBirth!: Date;
  donorCategory!: DonorCategory;
}

Donor.init(
  {
    idCopy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nationalNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    bankAccountNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: "Invalid date of birth",
        },
      },
    },
    donorCategory: {
      type: DataTypes.ENUM(...Object.values(DonorCategory)),
      allowNull: false,
      defaultValue: DonorCategory.OneTime,
    },
  },
  { sequelize, modelName: "Donor" }
);

Donor.hasMany(Donation, {
  foreignKey: "DonorId",
  as: "Donation",
});

Donation.belongsTo(Donor, {
  foreignKey: "DonorId",
  as: "Donor",
});

export default Donor;
