import { apiSlice } from "../api/apiSlice";
import { getExpenseFromResult } from "../../helper";

export const expenseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addExpense: builder.mutation({
      query: (data) => ({
        url: "add-expense",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Expense", id: "LIST" }],
    }),
    getExpenses: builder.query({
      query: () => ({
        url: "get-expenses",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (result) => [
        ...getExpenseFromResult(result),
        { type: "Expense", id: "LIST" },
      ],
    }),
    downloadExpenseExcel: builder.mutation<Blob, void>({
      query: () => ({
        url: "downloadexcel",
        method: "GET",
        credentials: "include" as const,
        responseHandler: (response) => response.blob(),
      }),
    }),
    deleteExpense: builder.mutation({
      query: ({ id }) => ({
        url: `delete-expense/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: (_result, _error, expenseId) => [
        { type: "Expense", id: expenseId },
        { type: "Expense", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useAddExpenseMutation,
  useGetExpensesQuery,
  useDownloadExpenseExcelMutation,
  useDeleteExpenseMutation,
} = expenseApi;
