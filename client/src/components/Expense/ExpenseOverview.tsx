import { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import CustomLineChart from "../Charts/CustomLineChart";
import { prepareExpenseLineChartData } from "../../utils/helper";
import type { Transaction } from "../../@types";

interface ExpenseOverviewProps {
  transactions: Transaction[];
  onAddExpense?: () => void;
}

// Define the chart data type
interface ChartDataItem {
  month: string;
  amount: number;
  category: string;
}

const ExpenseOverview = ({
  transactions,
  onAddExpense,
}: ExpenseOverviewProps) => {
  //   const data = [
  //     { month: "Jan", amount: 1200 },
  //     { month: "Feb", amount: 1500 },
  //     { month: "Mar", amount: 1800 },
  //     { month: "Apr", amount: 1100 },
  //     { month: "May", amount: 2000 },
  //     { month: "Jun", amount: 1700 },
  //     { month: "Jul", amount: 1900 },
  //     { month: "Aug", amount: 2100 },
  //     { month: "Sep", amount: 1600 },
  //     { month: "Oct", amount: 2300 },
  //     { month: "Nov", amount: 2500 },
  //     { month: "Dec", amount: 2700 },
  //   ];

  // Properly type the state
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    const result = prepareExpenseLineChartData(transactions);
    setChartData(result);

    return () => {};
  }, [transactions]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="">
          <h5 className="text-lg">Expense Overview</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            Track your spending trends over time and gain insights into where
            your money goes.
          </p>
        </div>

        <button className="add-btn" onClick={onAddExpense}>
          <LuPlus className="text-lg" />
          Add Expense
        </button>
      </div>

      <div className="mt-10">
        <CustomLineChart data={chartData} />
      </div>
    </div>
  );
};

export default ExpenseOverview;
