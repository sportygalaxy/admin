import { sportygalaxyAdminApi } from "@/store/storeQuerySlice";
import { RtkqTagEnum } from "@/constants/RtkqTagEnums";

export const ApiClientStoreSlice = sportygalaxyAdminApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<
      any,
      {
        pageIndex: number;
        pageSize: number;
        sorting: any;
        globalFilter: string | null;
        clientStatus: string | null;
        isDeleted?: boolean;
        isRequestDelete?: boolean;
      }
    >({
      query: ({
        pageIndex,
        pageSize,
        sorting,
        globalFilter,
        clientStatus,
        isDeleted,
        isRequestDelete,
      }) => {
        let params = new URLSearchParams({
          page: (pageIndex + 1).toString(), // Ensure 1-based index
          limit: pageSize.toString(),
          ...(globalFilter && { q: globalFilter }),
          ...(clientStatus && { search: clientStatus }),
          ...(isDeleted && { isDeleted }),
          ...(isRequestDelete && { isRequestDelete }),
          ...(sorting?.length && {
            sort: `${sorting[0].id},${sorting[0].desc ? "desc" : "asc"}`,
          }),
        });

        // console.log("params", params.toString());

        return {
          url: `/users?${params.toString()}`,
        };
      },
      providesTags: [RtkqTagEnum.USERS, RtkqTagEnum.CLIENTS],
    }),
    getClientInfo: builder.query<any, any>({
      query: ({ id }: any) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: [RtkqTagEnum.USERS, RtkqTagEnum.CLIENTS],
    }),
  }),
  overrideExisting: false,
});
