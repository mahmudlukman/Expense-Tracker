import { useState } from "react";
import ExpenseList from "../../components/Expense/ExpenseList";
import Modal from "../../components/Modal";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import toast from "react-hot-toast";
import DeleteAlert from "../../components/DeleteAlert";
import {
  useAddExpenseMutation,
  useGetExpensesQuery,
  useDownloadExpenseExcelMutation,
  useDeleteExpenseMutation,
} from "../../redux/features/Expense/expenseApi";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";

interface ExpenseFormData {
  category: string;
  amount: string;
  date: string;
  icon: string;
}

const Expense = () => {
  const {
    data,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useGetExpensesQuery({ refetchOnMountOrArgChange: true });

  const expenseData = data?.expenses || data || [];

  const [addExpense] = useAddExpenseMutation();
  const [deleteExpense, { isLoading: isDeletingExpense }] =
    useDeleteExpenseMutation();
  const [downloadExpenseExcel, { isLoading: isDownloading }] =
    useDownloadExpenseExcelMutation();

  // Modal states
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<{
    show: boolean;
    data: string | null;
  }>({
    show: false,
    data: null,
  });

  // Handle Add Income
  const handleAddExpense = async (expense: ExpenseFormData) => {
    const { category, amount, date, icon } = expense;

    // Validation Checks
    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      await addExpense({
        category,
        amount,
        date,
        icon,
      }).unwrap();

      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense. Please try again.");
    }
  };

  // Delete Income
  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense({ id }).unwrap();

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deleted successfully");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense. Please try again.");
    }
  };

  // Handle download income details
  const handleDownloadExpenseDetails = async () => {
    try {
      const blob = await downloadExpenseExcel().unwrap();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      window.URL.revokeObjectURL(url);

      toast.success("Expense details downloaded successfully");
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.");
    }
  };

  // Handle error state
  if (isError) {
    console.log("Something went wrong. Please try again.", error);
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout activeMenu="Expense">
        <div className="my-5 mx-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading expense data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadExpenseDetails}
            isDownloading={isDownloading}
          />

          <Modal
            isOpen={openAddExpenseModal}
            onClose={() => setOpenAddExpenseModal(false)}
            title="Add Expense"
          >
            <AddExpenseForm onAddExpense={handleAddExpense} />
          </Modal>

          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Expense"
          >
            <DeleteAlert
              content="Are you sure you want to delete this expense detail?"
              onDelete={() =>
                openDeleteAlert.data &&
                handleDeleteExpense(openDeleteAlert.data)
              }
              isLoading={isDeletingExpense}
            />
          </Modal>

          {/* Error state with retry option */}
          {isError && (
            <div className="mt-6 text-center">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-600 mb-2">Failed to load expense data</p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
