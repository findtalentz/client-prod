import Category from "./Category";
import User from "./User";

export default interface BlogSchema {
  _id: string;
  title: string;
  thumbnail: string;
  body: string;
  author: User;
  excerpt: string;
  category: Category;
  tags: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  createdAt: Date;
}
