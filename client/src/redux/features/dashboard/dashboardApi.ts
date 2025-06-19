import { apiSlice } from "../api/apiSlice";
import { getDashboardFromResult } from "../../helper";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => ({
        url: "dashboard",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (result) => [
        ...getDashboardFromResult(result),
        { type: "Dashboard", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
