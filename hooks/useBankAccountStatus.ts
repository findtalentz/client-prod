import BankAccountStatus from "@/schemas/BankAccountStatus";
import { createQuery } from "@/lib/create-query";

const useBankAccountStatus = createQuery<BankAccountStatus>({
  queryKey: ["bank_account_status"],
  url: "/auth/bank/status",
});

export default useBankAccountStatus;
