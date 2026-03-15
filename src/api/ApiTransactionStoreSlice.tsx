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
        const params = new URLSearchParams();

        params.set("page", (pageIndex + 1).toString());
        params.set("limit", pageSize.toString());

        if (globalFilter) {
          params.set("q", globalFilter);
        }

        if (transactionStatus) {
          params.set("status", transactionStatus);
        }

        if (isDeleted) {
          params.set("isDeleted", String(isDeleted));
        }

        if (isRequestDelete) {
          params.set("isRequestDelete", String(isRequestDelete));
        }

        if (sorting?.length) {
          const { id, desc } = sorting[0];
          params.set("sort", `${id},${desc ? "desc" : "asc"}`);
        }

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
