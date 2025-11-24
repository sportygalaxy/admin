import { sportygalaxyAdminApi } from "@/store/storeQuerySlice";
import { RtkqTagEnum } from "@/constants/RtkqTagEnums";

export const ApiSizeStoreSlice = sportygalaxyAdminApi.injectEndpoints({
  endpoints: (builder) => ({
    getSizes: builder.query<any, void>({
      query: () => ({
        url: "/products/size",
        method: "GET",
      }),
      providesTags: [RtkqTagEnum.PRODUCTS, RtkqTagEnum.SIZES],
    }),
    getSizeInfo: builder.query<any, any>({
      query: ({ id }: any) => ({
        url: `/products/size/${id}`,
        method: "GET",
      }),
      providesTags: [RtkqTagEnum.PRODUCTS, RtkqTagEnum.SIZES],
    }),
    createSize: builder.mutation<any, any>({
      query: ({ ...data }: any) => ({
        url: "/products/size",
        data,
        method: "POST",
      }),
      invalidatesTags: [RtkqTagEnum.PRODUCTS, RtkqTagEnum.SIZES],
    }),
    updateSize: builder.mutation<any, any>({
      query: ({ id, ...data }: any) => {
        return {
          url: `/products/size/${id}`,
          data,
          method: "PUT",
        };
      },
      invalidatesTags: [RtkqTagEnum.PRODUCTS, RtkqTagEnum.SIZES],
    }),
    deleteSize: builder.mutation<any, any>({
      query: ({ id }: any) => ({
        url: `/products/size/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async ({ queryFulfilled }: any) => {
        try {
          await queryFulfilled;
        } catch (error) {}
      },
      invalidatesTags: [RtkqTagEnum.PRODUCTS, RtkqTagEnum.SIZES],
    }),
  }),
  overrideExisting: false,
});
