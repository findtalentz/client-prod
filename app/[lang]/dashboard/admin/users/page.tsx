import UsersTable from "../_components/users-table";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <UsersTable />
    </div>
  );
}
