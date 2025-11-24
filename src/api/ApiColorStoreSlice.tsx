import { sportygalaxyAdminApi } from "@/store/storeQuerySlice";
import { RtkqTagEnum } from "@/constants/RtkqTagEnums";

export const ApiColorStoreSlice = sportygalaxyAdminApi.injectEndpoints({
  endpoints: (builder) => ({
    getColors: builder.query<any, void>({
      query: () => ({
        url: "/products/color",
        method: "GET",
      }),
      providesTags: [RtkqTagEnum.PRODUCTS, RtkqTagEnum.COLORS],
    }),
    getColorInfo: builder.query<any, any>({
      query: ({ id }: any) => ({
        url: `/products/color/${id}`,
        method: "GET",
      }),
      providesTags: [RtkqTagEnum.PRODUCTS, RtkqTagEnum.COLORS],
    }),
    createColor: builder.mutation<any, any>({
      query: ({ ...data }: any) => ({
        url: "/products/color",
        data,
        method: "POST",
      }),
      invalidatesTags: [RtkqTagEnum.PRODUCTS, RtkqTagEnum.COLORS],
    }),
    updateColor: builder.mutation<any, any>({
      query: ({ id, ...data }: any) => {
        return {
          url: `/products/color/${id}`,
          data,
          method: "PUT",
        };
      },
      invalidatesTags: [RtkqTagEnum.PRODUCTS, RtkqTagEnum.COLORS],
    }),
    deleteColor: builder.mutation<any, any>({
      query: ({ id }: any) => ({
        url: `/products/color/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async ({ queryFulfilled }: any) => {
        try {
          await queryFulfilled;
        } catch (error) {}
      },
      invalidatesTags: [RtkqTagEnum.PRODUCTS, RtkqTagEnum.COLORS],
    }),
  }),
  overrideExisting: false,
});
