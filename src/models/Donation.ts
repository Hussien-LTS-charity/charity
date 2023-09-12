import { DataTypes, Model, ValidationError } from "sequelize";
import sequelize from "./sequelize";
import {
  ClothingType,
  FurnitureType,
  monyDonationsSource,
} from "../config/enums";
import { DonationAttributes } from "../config/types";

class Donation extends Model<DonationAttributes> implements DonationAttributes {
  id!: number;
  DonorId!: number;
  donationDate!: Date;
  donationTook!: {
    isMony: boolean;
    mony: {
      monyDonationsSource: monyDonationsSource;
      monyAmount: number;
    };
    isClothes: boolean;
    clothes: {
      clothesName: ClothingType;
      amount: number;
    };
    isFurniture: boolean;
    furniture: {
      furnitureName: FurnitureType;
      amount: number;
    };
  };
  Properties!: string;
}

Donation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    DonorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    donationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isValidDate(value: Date): void {
          if (isNaN(value.getTime())) {
            throw new ValidationError("Invalid donation date.", []);
          }
        },
      },
    },
    donationTook: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    Properties: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Donation",
  }
);

export default Donation;
