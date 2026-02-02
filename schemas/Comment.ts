export default interface Comment {
  _id: string;
  message: string;
  job: string;
  reqFund: number;
  reqTime: Date;
  status: "PENDING" | "APPROVED" | "CANCELLED";
  reqType: "COMMENT" | "FUND_REQUEST" | "TIME_REQUEST" | "DELIVERY";
  client: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
  seller: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}
