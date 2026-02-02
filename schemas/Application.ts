import Job from "./Job";
import User from "./User";

export default interface Application {
  _id: string;
  message: string;
  job: Job;
  client: string;
  isViewed: boolean;
  attachments: string[];
  seller: User;
  createdAt: Date;
  updatedAt: Date;
}
