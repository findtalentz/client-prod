export interface Message {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
  message: string;
  type?: "message" | "offer";
  offer?: {
    _id: string;
    description: string;
    price: number;
    deliveryDays: number;
    revisions: number;
    status: "pending" | "accepted" | "declined" | "withdrawn";
    seller: string;
    buyer: string;
  };
  files: string[];
  createdAt: Date;
}
