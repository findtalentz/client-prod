import WithdrawalsTable from "../_components/withdrawals-table";

export default function WithdrawalsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Withdrawals</h1>
      <WithdrawalsTable />
    </div>
  );
}
