export type SeasonalTheme = "christmas" | "easter" | "newYear" | "blackFriday";
export type SeasonalCampaign = {
  enabled: boolean;
  startsAt: string | null;
  endsAt: string | null;
  title: string;
  headline: string;
  description: string;
  productIds: string[];
};
export type SeasonalSettings = {
  mode: "manual" | "scheduled";
  manualTheme: "default" | SeasonalTheme;
  campaigns: Record<SeasonalTheme, SeasonalCampaign>;
};
export type ProductOption = { id: string; name: string; modelNumber: string };
