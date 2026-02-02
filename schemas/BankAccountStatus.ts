export default interface BankAccountStatus {
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
  verificationStatus: "approved" | "pending" | "incomplete";
  disabledReason: string | null;
  currentlyDue: string[];
  pendingVerification: string[];
  externalAccounts: {
    id: string;
    object: string;
    bank_name?: string;
    last4?: string;
    status?: string;
    [key: string]: any;
  }[];
}
