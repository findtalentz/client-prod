// types/user.ts
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Add other user properties as needed
}

// types/kyc.ts
export enum VerificationStatus {
  "verified",
  "pending",
  "reject",
}

export enum VerificationType {
  PASSPORT = "passport",
  ID_CARD = "id",
}

interface BaseKYC {
  _id: string;
  user: User;
  verificationType: VerificationType;
  status: "verified" | "pending" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

export interface IDCardKYC extends BaseKYC {
  verificationType: VerificationType.ID_CARD;
  frontImage: string;
  backImage: string;
}

export interface PassportKYC extends BaseKYC {
  verificationType: VerificationType.PASSPORT;
  passportImage: string; // URL to the image
  passportNumber?: string;
  nationality?: string;
  expiryDate?: Date;
  issueDate?: Date;
}

export type KYC = IDCardKYC | PassportKYC;

// Utility type to check KYC type
export type KYCWithType<T extends VerificationType> = Extract<
  KYC,
  { verificationType: T }
>;
