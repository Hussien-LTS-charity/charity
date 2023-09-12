import { DataTypes, Model, ValidationError } from "sequelize";
import sequelize from "./sequelize";
import { ClothingType, FurnitureType } from "../config/enums";
import { AfterDonationsAttributes } from "../config/types";

class AfterDonations
  extends Model<AfterDonationsAttributes>
  implements AfterDonationsAttributes
{
  id!: number;
  DonationId!: number;
  AfterDonationId!: number;
  afterDonationDate!: Date;
  remainingDonation!: {
    monyAmount: number;
    clothesType: {
      clothesName: ClothingType;
      amount: number;
    };
    furnitureType: {
      furnitureName: FurnitureType;
      amount: number;
    };
  };
  Properties!: string;
}

AfterDonations.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    DonationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    AfterDonationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    afterDonationDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isValidDate(value: Date): void {
          if (isNaN(value.getTime())) {
            throw new ValidationError("Invalid donation date.", []);
          }
        },
      },
    },
    remainingDonation: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    Properties: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AfterDonations",
  }
);

AfterDonations.hasOne(AfterDonations, {
  foreignKey: "AfterDonationId",
  as: "partner",
});

export default AfterDonations;
