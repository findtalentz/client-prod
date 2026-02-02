export default interface SpendReport {
  monthlySpend: number;
  totalSpend: number;
  averateProjectCost: number;
  monthlySpendReport: {
    month: string;
    spend: number;
  }[];
}
