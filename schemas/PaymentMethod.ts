export interface BasePaymentMethod {
  _id: string;
  user: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BankPaymentMethod extends BasePaymentMethod {
  methodType: "bank";
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  routingNumber: string;
  accountType: "checking" | "savings";
}

export interface PayPalPaymentMethod extends BasePaymentMethod {
  methodType: "paypal";
  email: string;
}

export function isBankPaymentMethod(
  method: PaymentMethod
): method is BankPaymentMethod {
  return method.methodType === "bank";
}

export function isPayPalPaymentMethod(
  method: PaymentMethod
): method is PayPalPaymentMethod {
  return method.methodType === "paypal";
}

export type PaymentMethod = BankPaymentMethod | PayPalPaymentMethod;
