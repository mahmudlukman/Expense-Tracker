import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: ({ userId }) => ({
        url: `user/${userId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (arg) => [{ type: "User", id: arg.userId }],
    }),
    updateUser: builder.mutation({
      query: ({ data }) => ({
        url: "update-user",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      // The fix is here - make the invalidation safer
      invalidatesTags: (result) => {
        // Only invalidate if we have a successful result
        if (result?.success) {
          return [
            { type: "User", id: "me" },
            { type: "User", id: "LIST" },
          ];
        }
        return []; // Don't invalidate anything if there's an error
      },
    }),
  }),
});

export const { useGetUserQuery, useUpdateUserMutation } = userApi;
