import JobsTable from "../_components/jobs-table";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Jobs</h1>
      <JobsTable />
    </div>
  );
}
