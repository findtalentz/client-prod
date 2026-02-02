import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import Balance from "@/schemas/Balance";
import {
  Briefcase,
  Calendar,
  Clock,
  Clock10,
  DollarSign,
  User,
} from "lucide-react";

interface Props {
  balances: Balance[];
}

export default function BalanceTable({ balances }: Props) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculateDaysRemaining = (clearDate: Date) => {
    const today = new Date();
    const clear = new Date(clearDate);
    const diffTime = clear.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.min(15, diffDays));
  };

  return (
    <Card className="border">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Balance Overview
          </CardTitle>
          <Badge variant="secondary" className="px-3 py-1">
            {balances.length} entries
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Date
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Clock10 className="h-4 w-4" />
                  Activity
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Client
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  Job
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-0">
                  <DollarSign className="h-4 w-4" />
                  Amount
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {balances.map((balance) => {
              const daysRemaining = calculateDaysRemaining(balance.clearDate);

              return (
                <TableRow key={balance._id} className="hover:bg-gray-50/50">
                  <TableCell>{formatDate(balance.createdAt)}</TableCell>

                  <TableCell>
                    <Slider
                      value={[15 - daysRemaining]}
                      max={15}
                      step={1}
                      className="w-30"
                      disabled
                    />
                  </TableCell>

                  <TableCell>
                    {balance.client.firstName} {balance.client.lastName}
                  </TableCell>

                  <TableCell>{balance.job.title}</TableCell>

                  <TableCell>{formatAmount(balance.amount)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {balances.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No balance entries found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
