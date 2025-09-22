import { sportygalaxyAdminApi } from "@/store/storeQuerySlice";
import { RtkqTagEnum } from "@/constants/RtkqTagEnums";

export const ApiOrderStoreSlice = sportygalaxyAdminApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<
      any,
      {
        pageIndex: number;
        pageSize: number;
        sorting: any;
        globalFilter: string | null;
        orderStatus: string | null;
        isDeleted?: boolean;
        isRequestDelete?: boolean;
      }
    >({
      query: ({
        pageIndex,
        pageSize,
        sorting,
        globalFilter,
        orderStatus,
        isDeleted,
        isRequestDelete,
      }) => {
        let params = new URLSearchParams({
          page: pageIndex, // Ensure 1-based index
          limit: pageSize,
          ...(globalFilter && { q: globalFilter }),
          ...(orderStatus && {
            status: orderStatus,
          }),
          ...(isDeleted && { isDeleted }),
          ...(isRequestDelete && { isRequestDelete }),
          ...(sorting?.length && {
            sort: `${sorting[0].id},${sorting[0].desc ? "desc" : "asc"}`,
          }),
        });

        // console.log("params", params.toString());

        return {
          url: `/orders?${params.toString()}`,
        };
      },
      providesTags: [RtkqTagEnum.ORDERS],
    }),
    getOrderInfo: builder.query<any, any>({
      query: ({ id }: any) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: [RtkqTagEnum.ORDERS],
    }),
    createOrder: builder.mutation<any, any>({
      query: ({ ...data }: any) => ({
        url: "/orders",
        data,
        method: "POST",
      }),
      invalidatesTags: [RtkqTagEnum.ORDERS],
    }),
    updateOrder: builder.mutation<any, any>({
      query: ({ id, ...data }: any) => ({
        url: `/orders/${id}/status`,
        data,
        method: "PATCH",
      }),
      invalidatesTags: [RtkqTagEnum.ORDERS],
    }),
    deleteOrder: builder.mutation<any, any>({
      query: ({ id, ...data }: any) => ({
        url: `/orders/${id}`,
        data,
        method: "DELETE",
      }),
      invalidatesTags: [RtkqTagEnum.ORDERS],
    }),
  }),
  overrideExisting: false,
});

//  uploadPhoto: builder.mutation<UploadPhotoResponse, UploadPhotoRequest>({
//       query: (data: UploadPhotoRequest) => ({
//         url: "/api/v2/upload/file",
//         data,
//         method: "POST",
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }),
//       invalidatesTags: [RtkqTagEnum.USERS],
//     }),
