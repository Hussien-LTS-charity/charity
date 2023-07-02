import {
  ClothingType,
  DonorCategory,
  FamilyCategory,
  FurnitureType,
  Gender,
  MaritalStatus,
  Priority,
  monyDonationsSource,
} from "./enums";

export interface FamilyAttributes {
  id: number;
  // DonationId: number;
  personCharge: number;
  email: string;
  address: string;
  contactNumber: string;
  houseCondition: string;
  notes: string;
  familyCategory: FamilyCategory;
  familyPriority: Priority;
}

export interface FamilyMemberAttributes {
  id: number;
  FamilyId: number;
  firstName: string;
  lastName: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  address: string;
  email: string;
  dateOfBirth: Date;
  phoneNumber: string;
  isWorking: boolean;
  isPersonCharge: boolean;
  proficient: string;
  totalIncome: number;
  educationLevel: number;
}

export interface HealthHistoryAttributes {
  id: number;
  FamilyId: number;
  familyMemberId: number;
  disease: {
    diseaseName: string;
    medicineName: string;
  };
}

export interface MemberNeedsAttributes {
  id: number;
  FamilyId: number;
  familyMemberId: number;
  needName: string;
  MemberPriority: Priority;
}

export interface DonorAttributes {
  id: number;
  idCopy: string;
  nationalNumber: number;
  firstName: string;
  lastName: string;
  gender: Gender;
  email: string;
  bankAccountNumber: number;
  address: string;
  phoneNumber: string;
  dateOfBirth: Date;
  donorCategory: DonorCategory;
}

export interface DonationAttributes {
  id: number;
  DonorId: number;
  donationDate: Date;
  donationTook: {
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
  Properties: string;
}

export interface AfterDonationsAttributes {
  id: number;
  DonationId: number;
  AfterDonationId: number;
  afterDonationDate: Date;
  remainingDonation: {
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
  Properties: string;
}

export interface DonationsRecordAttributes {
  id: number;
  FamilyId: number;
  // FamilyMemberId: number;
  donationDate: Date;
  donationGiven: {
    isMony: boolean;
    mony: {
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
