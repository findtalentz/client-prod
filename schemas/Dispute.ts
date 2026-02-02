export default interface Dispute {
  _id: string;
  title: string;
  user: {
    firstName: string;
    lastName: string;
  };
  job: {
    _id: string;
    title: string;
    description: string;
  };
  type: string;
  status: string;
  evidence: string;
  description: string;
  updatedAt: Date;
  createdAt: Date;
}
