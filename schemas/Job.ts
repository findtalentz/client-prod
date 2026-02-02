import Category from "./Category";
import User from "./User";

export default interface Job {
  _id: string;
  author: User;
  title: string;
  category: Category;
  type: "fixed" | "hourly";
  jobSize: "large" | "medium" | "small";
  deliveryDate: Date;
  startDate: Date;
  budgetAmount: number;
  seller: User;
  description: string;
  status: "IN_PROGRESS" | "OPEN" | "COMPLETED";
  location: string;
  jobType: string;
  requiredExperienceLevel: string;
  duration: string;
  requiredSkills: string[];
  budgetType: string;
  completedAt: Date;
  company: string;
  createdAt: Date;
}
