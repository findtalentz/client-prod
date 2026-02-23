import TransactionsTable from "../_components/transactions-table";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Transactions</h1>
      <TransactionsTable />
    </div>
  );
}
