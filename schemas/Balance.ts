import Job from "./Job";
import User from "./User";

export default interface Balance {
  _id: string;
  user: string;
  amount: number;
  status: "PENDING" | "CLEARED" | "HELD";
  clearDate: Date;
  job: Job;
  client: User;
  createdAt: Date;
  updateddAt: Date;
}
