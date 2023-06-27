import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import {
  ClothingType,
  FurnitureType,
  monyDonationsSource,
} from "../config/enums";
import { DonationsRecordAttributes } from "../config/types";
import Donation from "./Donation";
import Family from "./Family";
import FamilyMember from "./FamilyMember";

class DonationsRecord
  extends Model<DonationsRecordAttributes>
  implements DonationsRecordAttributes
{
  id!: number;
  DonationId!: number;
  FamilyId!: number;
  FamilyMemberId!: number;
  donationDate!: Date;
  donationGiven!: {
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
}

DonationsRecord.init(
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
    FamilyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    FamilyMemberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    donationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: "Invalid date of birth",
        },
      },
    },
    donationGiven: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "DonationsRecord",
  }
);

Donation.hasOne(DonationsRecord, {
  foreignKey: "DonationId",
  as: "DonationsRecords",
});

DonationsRecord.belongsTo(Donation, {
  foreignKey: "DonationId",
  as: "Donor",
});

Donation.hasOne(Family, {
  foreignKey: "FamilyId",
  as: "Family",
});

Family.belongsTo(Donation, {
  foreignKey: "FamilyId",
  as: "Donation",
});

Donation.hasOne(FamilyMember, {
  foreignKey: "FamilyMemberId",
  as: "FamilyMember",
});

FamilyMember.belongsTo(Donation, {
  foreignKey: "FamilyMemberId",
  as: "Donation",
});
export default DonationsRecord;
