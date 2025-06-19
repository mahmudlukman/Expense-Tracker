import { useEffect, useState } from "react";
import CustomPieChart from "../Charts/CustomPieChart";

interface IncomeData {
  source: string;
  amount: number;
}

interface RecentIncomeProps {
  data: IncomeData[];
  totalIncome: number;
}

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"];

const RecentIncomeWithChart = ({ data, totalIncome }: RecentIncomeProps) => {
  const [chartData, setChartData] = useState<{ name: string; amount: number; }[]>([]);

  const prepareChartData = () => {
    const dataArr = data?.map((item) => ({
      name: item?.source,
      amount: item?.amount,
    }));

    setChartData(dataArr);
  };

  useEffect(() => {
    prepareChartData();

    return () => {};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="card">
      <div className="flex items-center justify-between ">
        <h5 className="text-lg">Last 60 Days Income</h5>
      </div>

      <CustomPieChart
        data={chartData}
        label="Total Income"
        totalAmount={`$${totalIncome}`}
        showTextAnchor
        colors={COLORS}
      />
    </div>
  );
};

export default RecentIncomeWithChart;
