import { sportygalaxyAdminApi } from "@/store/storeQuerySlice";
import { RtkqTagEnum } from "@/constants/RtkqTagEnums";

export const ApiTransactionStoreSlice = sportygalaxyAdminApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<
      any,
      {
        pageIndex: number;
        pageSize: number;
        sorting: any;
        globalFilter: string | null;
        transactionStatus: string | null;
        isDeleted?: boolean;
        isRequestDelete?: boolean;
      }
    >({
      query: ({
        pageIndex,
        pageSize,
        sorting,
        globalFilter,
        transactionStatus,
        isDeleted,
        isRequestDelete,
      }) => {
        let params = new URLSearchParams({
          page: (pageIndex + 1).toString(), // Ensure 1-based index
          limit: pageSize,
          ...(globalFilter && { q: globalFilter }),
          ...(transactionStatus && {
            status: transactionStatus,
          }),
          ...(isDeleted && { isDeleted }),
          ...(isRequestDelete && { isRequestDelete }),
          ...(sorting?.length && {
            sort: `${sorting[0].id},${sorting[0].desc ? "desc" : "asc"}`,
          }),
        });

        // Handle sorting dynamically for multiple fields
        if (sorting?.length) {
          sorting.forEach(({ id, desc }: any) => {
            params.append("sort", `${id},${desc ? "desc" : "asc"}`);
          });
        }

        console.log("params", params.toString());

        return {
          url: `/payments?${params.toString()}`,
        };
      },
      providesTags: [RtkqTagEnum.TRANSACTIONS],
    }),
    getTransactionInfo: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/payments/${id}`,
      }),
      providesTags: [RtkqTagEnum.TRANSACTIONS],
    }),
  }),
  overrideExisting: false,
});
