import { sportygalaxyAdminApi } from "@/store/storeQuerySlice";
import { RtkqTagEnum } from "@/constants/RtkqTagEnums";
import type { ProductOption, SeasonalSettings } from "@/types/seasonal";

type ApiResponse<T> = { success: boolean; data: T };

export const ApiSeasonalStoreSlice = sportygalaxyAdminApi.injectEndpoints({
  endpoints: (builder) => ({
    getSeasonalSettings: builder.query<ApiResponse<SeasonalSettings>, void>({
      query: () => ({ url: "/seasonal/settings", method: "GET" }),
      providesTags: [RtkqTagEnum.SEASONAL],
    }),
    saveSeasonalSettings: builder.mutation<ApiResponse<SeasonalSettings>, SeasonalSettings>({
      query: (data) => ({ url: "/seasonal/settings", method: "PUT", data }),
      invalidatesTags: [RtkqTagEnum.SEASONAL],
    }),
    getSeasonalProductOptions: builder.query<ApiResponse<ProductOption[]>, { q?: string; ids?: string }>({
      query: ({ q, ids }) => ({ url: "/seasonal/product-options", method: "GET", params: { q, ids } }),
    }),
  }),
});

export const {
  useGetSeasonalSettingsQuery,
  useSaveSeasonalSettingsMutation,
  useGetSeasonalProductOptionsQuery,
} = ApiSeasonalStoreSlice;
