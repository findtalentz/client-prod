import Job from "./Job";

interface RankByNumberProduct {
  category: string;
  totalJobs: number;
  jobs: Job[];
}

export default interface ActiveJobReport {
  activeJobCount: number;
  rankOneByCategory: RankByNumberProduct;
  rankTwoByCategory: RankByNumberProduct;
  rankThreeByCategory: RankByNumberProduct;
  rankFourByCategory: RankByNumberProduct;
}
