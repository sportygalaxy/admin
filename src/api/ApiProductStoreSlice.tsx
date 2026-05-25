import { sportygalaxyAdminApi } from "@/store/storeQuerySlice";
import { RtkqTagEnum } from "@/constants/RtkqTagEnums";

export const ApiProductStoreSlice = sportygalaxyAdminApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      any,
      {
        pageIndex: number;
        pageSize: number;
        sorting: any;
        globalFilter: string | null;
        productStatus: any;
        isDeleted?: boolean;
        isRequestDelete?: boolean;
      }
    >({
      query: ({
        pageIndex,
        pageSize,
        sorting,
        globalFilter,
        productStatus,
        isDeleted,
        isRequestDelete,
      }) => {
        const params = new URLSearchParams();

        params.set("page", (pageIndex + 1).toString());
        params.set("limit", pageSize.toString());

        if (globalFilter) {
          params.set("q", globalFilter);
        }

        if (productStatus) {
          params.set("q", productStatus);
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
          url: `/admin-products?${params.toString()}`,
        };
      },
      providesTags: [RtkqTagEnum.PRODUCTS],
    }),
    getProductInfo: builder.query<any, any>({
      query: ({ id }: any) => ({
        url: `/admin-products/${id}`,
        method: "GET",
      }),
      providesTags: [RtkqTagEnum.PRODUCTS],
    }),
    createProduct: builder.mutation<any, any>({
      query: ({ ...data }: any) => ({
        url: "/products",
        data,
        method: "POST",
      }),
      invalidatesTags: [RtkqTagEnum.PRODUCTS],
    }),
    updateProduct: builder.mutation<any, any>({
      query: ({ id, ...data }: any) => ({
        url: `/products/${id}`,
        data,
        method: "PUT",
      }),
      invalidatesTags: [RtkqTagEnum.PRODUCTS],
    }),
    deactivateProduct: builder.mutation<any, any>({
      query: ({ id, ...data }: any) => ({
        url: `/admin-products/${id}/de-activate`,
        data,
        method: "PUT",
      }),
      invalidatesTags: [RtkqTagEnum.PRODUCTS],
    }),
    reactivateProduct: builder.mutation<any, any>({
      query: ({ id, ...data }: any) => ({
        url: `/admin-products/${id}/re-activate`,
        data,
        method: "PUT",
      }),
      invalidatesTags: [RtkqTagEnum.PRODUCTS],
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
