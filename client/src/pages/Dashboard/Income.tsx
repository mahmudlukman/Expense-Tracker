import { useState } from "react";
import IncomeOverview from "../../components/Income/IncomeOverview";
import IncomeList from "../../components/Income/IncomeList";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast";
import DeleteAlert from "../../components/DeleteAlert";
import {
  useAddIncomeMutation,
  useGetIncomesQuery,
  useDownloadIncomeExcelMutation,
  useDeleteIncomeMutation,
} from "../../redux/features/Income/incomeApi";
import DashboardLayout from "../../components/Layouts/DashboardLayout";

interface IncomeFormData {
  source: string;
  amount: string;
  date: string;
  icon: string;
}

const Income = () => {
  const {
    data,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useGetIncomesQuery({ refetchOnMountOrArgChange: true });

  const incomeData = data?.income || data || [];
  
  const [addIncome, { isLoading: isAddingIncome }] = useAddIncomeMutation();
  const [deleteIncome, { isLoading: isDeletingIncome }] =
    useDeleteIncomeMutation();
  const [downloadIncomeExcel, { isLoading: isDownloading }] =
    useDownloadIncomeExcelMutation();

  // Modal states
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<{
    show: boolean;
    data: string | null;
  }>({
    show: false,
    data: null,
  });

  // Handle Add Income
  const handleAddIncome = async (income: IncomeFormData) => {
    const { source, amount, date, icon } = income;

    // Validation Checks
    if (!source.trim()) {
      toast.error("Source is required.");
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
      await addIncome({
        source,
        amount,
        date,
        icon,
      }).unwrap();

      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
    } catch (error) {
      console.error("Error adding income:", error);
      toast.error("Failed to add income. Please try again.");
    }
  };

  // Delete Income
  const handleDeleteIncome = async (id: string) => {
    try {
      await deleteIncome({ id }).unwrap();

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income details deleted successfully");
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Failed to delete income. Please try again.");
    }
  };

  // Handle download income details
  const handleDownloadIncomeDetails = async () => {
    try {
      const blob = await downloadIncomeExcel().unwrap();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      window.URL.revokeObjectURL(url);

      toast.success("Income details downloaded successfully");
    } catch (error) {
      console.error("Error downloading income details:", error);
      toast.error("Failed to download income details. Please try again.");
    }
  };

  // Handle error state
  if (isError) {
    console.log("Something went wrong. Please try again.", error);
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout activeMenu="Income">
        <div className="my-5 mx-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading income data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          <IncomeList
            transactions={incomeData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadIncomeDetails}
            isDownloading={isDownloading}
          />

          <Modal
            isOpen={openAddIncomeModal}
            onClose={() => setOpenAddIncomeModal(false)}
            title="Add Income"
          >
            <AddIncomeForm
              onAddIncome={handleAddIncome}
              isLoading={isAddingIncome}
            />
          </Modal>

          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Income"
          >
            <DeleteAlert
              content="Are you sure you want to delete this income detail?"
              onDelete={() =>
                openDeleteAlert.data && handleDeleteIncome(openDeleteAlert.data)
              }
              isLoading={isDeletingIncome}
            />
          </Modal>

          {/* Error state with retry option */}
          {isError && (
            <div className="mt-6 text-center">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-600 mb-2">Failed to load income data</p>
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

export default Income;
