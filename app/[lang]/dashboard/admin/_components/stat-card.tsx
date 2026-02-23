import { Card } from "@/components/ui/card";
import { LuArrowDown, LuArrowUp } from "react-icons/lu";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel,
}: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <Card className="rounded-3xl border shadow p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1">
              {isPositive ? (
                <LuArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <LuArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}
              >
                {Math.abs(trend)}%
              </span>
              {trendLabel && (
                <span className="text-xs text-muted-foreground">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-xl">
          {icon}
        </div>
      </div>
    </Card>
  );
}
