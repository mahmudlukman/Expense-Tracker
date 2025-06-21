import moment from "moment";
import { LuDownload } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import type { Transaction } from "../../@types";

interface ExpenseListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onDownload: () => void;
  isDownloading: boolean;
}

const ExpenseList = ({
  transactions,
  onDelete,
  onDownload,
}: ExpenseListProps) => {
  // Ensure transactions is always an array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">All Expanses</h5>

        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {safeTransactions.length > 0 ? (
          safeTransactions.map((expense) => (
            <TransactionInfoCard
              key={expense._id}
              title={expense.category}
              icon={expense.icon}
              date={moment(expense.date).format("Do MMM YYYY")}
              amount={expense.amount}
              type="expense"
              onDelete={() => onDelete(expense._id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No income records found
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
