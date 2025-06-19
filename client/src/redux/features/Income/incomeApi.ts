import { apiSlice } from "../api/apiSlice";
import { getIncomeFromResult } from "../../helper";

export const incomeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addIncome: builder.mutation({
      query: (data) => ({
        url: "add-income",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Income", id: "LIST" }],
    }),
    getIncomes: builder.query({
      query: () => ({
        url: "get-incomes",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (result) => [
        ...getIncomeFromResult(result),
        { type: "Income", id: "LIST" },
      ],
    }),
    downloadIncomeExcel: builder.mutation<Blob, void>({
      query: () => ({
        url: "downloadexcel",
        method: "GET",
        credentials: "include" as const,
        responseHandler: (response) => response.blob(),
      }),
    }),
    deleteIncome: builder.mutation({
      query: ({ id }) => ({
        url: `delete-income/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: (_result, _error, incomeId) => [
        { type: "Income", id: incomeId },
        { type: "Income", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useAddIncomeMutation,
  useGetIncomesQuery,
  useDownloadIncomeExcelMutation,
  useDeleteIncomeMutation,
} = incomeApi;
