export default interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  skills: [string];
  balance: number;
  languages: [string];
  role: "SELLER" | "CLIENT";
  image: string;
  phone?: string;
  totalEarning: number;
  totalSpend: number;
  location: string;
  title: string;
  emailStatus: "UNVERIFIED" | "VERIFIED";
  about: string;
  createdAt: Date;
  identityStatus: "UNVERIFIED" | "VERIFIED" | "PENDING";
}
