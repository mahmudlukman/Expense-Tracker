import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { addThousandsSeparator } from "../../utils/helper";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import RecentIncome from "../../components/Dashboard/RecentIncome";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useGetDashboardDataQuery } from "../../redux/features/dashboard/dashboardApi";
import InfoCard from "../../components/Cards/InfoCard";
import Last30DaysExpenses from "../../components/Dashboard/Last30DaysExpense";

const Home = () => {
  const navigate = useNavigate();
  
  // Use RTK Query hook
  const {
    data: dashboardData,
    isLoading: loading,
    isError,
    error,
    refetch
  } = useGetDashboardDataQuery({});

  // Handle error state
  if (isError) {
    console.log("Something went wrong. Please try again.", error);
  }

  // Optional: Add loading state UI
  if (loading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="my-5 mx-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expenses"
            value={addThousandsSeparator(dashboardData?.totalExpenses || 0)}
            color="bg-red-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/expense")}
          />
          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpenses || 0}
          />
          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore={() => navigate("/expense")}
          />
          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions || []}
          />
          <RecentIncomeWithChart
            data={dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []}
            totalIncome={dashboardData?.totalIncome || 0}
          />
          <RecentIncome
            transactions={dashboardData?.last60DaysIncome?.transactions || []}
            onSeeMore={() => navigate("/income")}
          />
        </div>

        {/* Optional: Add refresh button */}
        {isError && (
          <div className="mt-6 text-center">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Retry Loading Data
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Home;