export default interface Withdraw {
  _id: string;
  amount: number;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  status: "PENDING" | "COMPLETED" | "FAILED";
  paymentMethodId?: string;
  paymentGateway?: "stripe" | "paypal";
  gatewayRef?: string;
  createdAt: Date;
}
