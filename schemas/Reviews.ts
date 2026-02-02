import User from "./User";

export default interface Review {
  _id: string;
  job: string;
  seller: User;
  buyer: User;
  servicesRating: number;
  communicationRating: number;
  recommendationRating: number;
  descriptionRating: number;
  averageRating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}
