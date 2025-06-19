
import { LuArrowRight } from "react-icons/lu";
import moment from "moment";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

interface Transaction {
  _id: string;
  type: 'expense' | 'income';
  category?: string;
  source?: string;
  icon: string;
  date: string;
  amount: number;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  onSeeMore: () => void;
}

const RecentTransactions = ({transactions, onSeeMore}: RecentTransactionsProps) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between ">
        <h5 className="text-lg">Recent Transactions</h5>

        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0,5)?.map((item) => (
          <TransactionInfoCard
            key={item._id}
            title={item.type == 'expense' ? item.category ?? 'Unknown' : item.source ?? 'Unknown'}
            icon={item.icon}
            date={moment(item.date).format("Do MMM YYYY")}
            amount={item.amount}
            type={item.type}
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
