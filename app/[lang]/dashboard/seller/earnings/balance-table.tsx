import { Card, CardContent } from "@/components/ui/card";
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
import { Clock } from "lucide-react";

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

  if (balances.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No earnings yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Clearance</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Job</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {balances.map((balance) => {
              const daysRemaining = calculateDaysRemaining(balance.clearDate);

              return (
                <TableRow key={balance._id}>
                  <TableCell className="text-sm">
                    {formatDate(balance.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Slider
                      value={[15 - daysRemaining]}
                      max={15}
                      step={1}
                      className="w-24"
                      disabled
                    />
                  </TableCell>
                  <TableCell className="text-sm">
                    {balance.client.firstName} {balance.client.lastName}
                  </TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">
                    {balance.job.title}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatAmount(balance.amount)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
