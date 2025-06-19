import moment from "moment";
import { LuDownload } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import type { Transaction } from "../../@types";

interface IncomeListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onDownload: () => void;
  isDownloading: boolean;
}

const IncomeList = ({ transactions, onDelete, onDownload, isDownloading }: IncomeListProps) => {
  // Ensure transactions is always an array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income Sources</h5>

        <button 
          className="card-btn" 
          onClick={onDownload}
          disabled={isDownloading}
        >
          <LuDownload className="text-base" /> 
          {isDownloading ? 'Downloading...' : 'Download'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {safeTransactions.length > 0 ? (
          safeTransactions.map((income) => (
            <TransactionInfoCard
              key={income._id}
              title={income.source}
              icon={income.icon}
              date={moment(income.date).format("Do MMM YYYY")}
              amount={income.amount}
              type="income"
              onDelete={() => onDelete(income._id)}
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

export default IncomeList;