import { ChartData } from "@/components/app-area-chart";
import { BarChartData } from "@/components/app-bar-chart";
import AdminStats from "@/schemas/AdminStats";
import ActivityItem from "@/schemas/ActivityItem";
import ApiResponse from "@/schemas/ApiRespose";
import apiClient from "@/services/api-client";
import { LuTriangleAlert, LuDollarSign, LuUsers } from "react-icons/lu";
import { IoBriefcaseOutline } from "react-icons/io5";
import StatCard from "./_components/stat-card";
import RevenueChart from "./_components/revenue-chart";
import UserGrowthChart from "./_components/user-growth-chart";
import JobDistributionChart from "./_components/job-distribution-chart";
import RecentActivity from "./_components/recent-activity";

export default async function AdminDashboard() {
  const [statsRes, revenueRes, growthRes, activityRes] = await Promise.all([
    apiClient.get<ApiResponse<AdminStats>>("/admin/stats"),
    apiClient.get<ApiResponse<ChartData[]>>("/admin/revenue-chart"),
    apiClient.get<ApiResponse<BarChartData[]>>("/admin/user-growth"),
    apiClient.get<ApiResponse<ActivityItem[]>>("/admin/recent-activity"),
  ]);

  const stats = statsRes.data.data;
  const revenueData = revenueRes.data.data;
  const growthData = growthRes.data.data;
  const activities = activityRes.data.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<LuUsers />}
          trend={stats.userGrowthPercent}
          trendLabel="vs last month"
          subtitle={`${stats.totalClients} clients, ${stats.totalSellers} sellers`}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={<LuDollarSign />}
          trend={stats.revenueGrowthPercent}
          trendLabel="vs last month"
          subtitle={`$${stats.totalRevenue.toLocaleString()} total`}
        />
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs.toLocaleString()}
          icon={<IoBriefcaseOutline />}
          subtitle={`${stats.completedJobs} completed`}
        />
        <StatCard
          title="Open Disputes"
          value={stats.openDisputes.toLocaleString()}
          icon={<LuTriangleAlert />}
          subtitle={`${stats.pendingWithdrawals} pending withdrawals`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart data={revenueData} />
        <UserGrowthChart data={growthData} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <JobDistributionChart
          activeJobs={stats.activeJobs}
          completedJobs={stats.completedJobs}
          totalJobs={stats.totalJobs}
        />
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
}
