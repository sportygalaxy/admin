import { useEffect, useMemo, useState } from "react";
import {
  Alert, Autocomplete, Chip, CircularProgress, FormControl, FormControlLabel,
  MenuItem, Select, Switch, Tab, Tabs, TextField, Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Breadcrumb, type BreadcrumbItem } from "@/common/Breadcrum";
import BackButton from "@/common/BackButton";
import { routeEnum } from "@/constants/RouteConstants";
import { USER_ROLE } from "@/constants/roles";
import useAuthUser from "@/hooks/useAuthUser";
import useExtendedSnackbar from "@/hooks/useExtendedSnackbar";
import {
  useGetSeasonalProductOptionsQuery,
  useGetSeasonalSettingsQuery,
  useSaveSeasonalSettingsMutation,
} from "@/api/ApiSeasonalStoreSlice";
import type { SeasonalCampaign, SeasonalSettings, SeasonalTheme } from "@/types/seasonal";

const THEMES: { id: SeasonalTheme; label: string }[] = [
  { id: "christmas", label: "Christmas" },
  { id: "easter", label: "Easter" },
  { id: "newYear", label: "New Year" },
  { id: "blackFriday", label: "Black Friday" },
];
const breadcrumbItems: BreadcrumbItem[] = [
  { path: routeEnum.DASHBOARD, label: "Dashboard" },
  { path: routeEnum.SETTINGS, label: "Settings" },
];
const fieldClass = "MuiTextFieldOutlined--plain font-inter";
const labelClass = "text-sm font-medium font-inter";

const toLocalInput = (date: string | null) => {
  if (!date) return "";
  const value = new Date(date);
  return new Date(value.getTime() - value.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};
const toUtc = (value: string) => value ? new Date(value).toISOString() : null;

export default function SeasonalSettingsPage() {
  const user = useAuthUser();
  const isDeveloper = user?.role === USER_ROLE.SUPER_ADMIN;
  const { showSuccessSnackbar, showErrorSnackbar } = useExtendedSnackbar();
  const { data, isLoading, error: loadError } = useGetSeasonalSettingsQuery();
  const [saveSettings, { isLoading: isSaving }] = useSaveSeasonalSettingsMutation();
  const [draft, setDraft] = useState<SeasonalSettings | null>(null);
  const [theme, setTheme] = useState<SeasonalTheme>("christmas");
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => {
    if (data?.data && !draft) setDraft(structuredClone(data.data));
  }, [data, draft]);

  const allSelectedIds = draft
    ? [...new Set(THEMES.flatMap(({ id }) => draft.campaigns[id].productIds))].join(",") : "";
  const { data: selectedResponse } = useGetSeasonalProductOptionsQuery(
    { ids: allSelectedIds }, { skip: !allSelectedIds }
  );
  const { data: searchedResponse, isFetching: isSearching } = useGetSeasonalProductOptionsQuery({ q: productSearch });
  const productOptions = useMemo(() => {
    const products = [...(selectedResponse?.data ?? []), ...(searchedResponse?.data ?? [])];
    return [...new Map(products.map((product) => [product.id, product])).values()];
  }, [selectedResponse, searchedResponse]);

  const updateCampaign = (changes: Partial<SeasonalCampaign>) => {
    setDraft((current) => current ? {
      ...current,
      campaigns: { ...current.campaigns, [theme]: { ...current.campaigns[theme], ...changes } },
    } : current);
  };

  const handleSave = async () => {
    if (!draft) return;
    try {
      const saved = await saveSettings(draft).unwrap();
      setDraft(structuredClone(saved.data));
      showSuccessSnackbar("Seasonal settings saved successfully.");
    } catch (error) {
      const response = error as { data?: { error?: string }; defaultUserMessage?: string };
      showErrorSnackbar(response.data?.error ?? response.defaultUserMessage ?? "Could not save seasonal settings.");
    }
  };

  const campaign = draft?.campaigns[theme];
  const optionById = new Map(productOptions.map((product) => [product.id, product]));
  const selectedProducts = (campaign?.productIds ?? []).map((id) => optionById.get(id) ?? { id, name: id, modelNumber: "" });

  return (
    <div className="container-wrapper min-h-[calc(100vh-118.5px)] py-[30px]">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="space-y-5">
          <BackButton />
          <div>
            <Breadcrumb breadcrumbItems={breadcrumbItems} />
            <Typography color="grey.900" className="text-2xl font-bold font-crimson">
              Seasonal storefront
            </Typography>
            <Typography color="grey.600" className="mt-1 text-sm font-medium font-inter">
              Configure the campaigns shown on the website and mobile app.
            </Typography>
          </div>
        </div>
        <LoadingButton variant="contained" size="large" loading={isSaving}
          disabled={!draft || Boolean(loadError)} onClick={handleSave}
          className="capitalize font-bold font-inter">
          Save
        </LoadingButton>
      </div>

      {isLoading ? (
        <div className="mt-10"><CircularProgress aria-label="Loading seasonal settings" /></div>
      ) : loadError || !draft || !campaign ? (
        <Alert severity="error" className="mt-10">Could not load seasonal settings. Refresh the page to retry.</Alert>
      ) : (
        <div className="mt-10 space-y-6">
          {isDeveloper && (
            <section className="rounded-xl border border-[#EAECF0] bg-white p-5 md:p-6">
              <Typography color="grey.900" className="text-lg font-semibold font-inter">Storefront activation</Typography>
              <Typography color="grey.600" className="mb-5 text-sm font-inter">
                Select a campaign manually or set its active dates below.
              </Typography>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Typography id="seasonal-mode-label" component="label" htmlFor="seasonal-mode" color="grey.700" className={labelClass}>Activation mode</Typography>
                  <FormControl fullWidth size="small">
                    <Select id="seasonal-mode" labelId="seasonal-mode-label" value={draft.mode} className={fieldClass}
                      onChange={(event) => setDraft({ ...draft, mode: event.target.value as SeasonalSettings["mode"] })}>
                      <MenuItem value="manual">Manual</MenuItem>
                      <MenuItem value="scheduled">Scheduled</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                {draft.mode === "manual" && <div className="space-y-2">
                  <Typography id="active-theme-label" component="label" htmlFor="active-theme" color="grey.700" className={labelClass}>Active theme</Typography>
                  <FormControl fullWidth size="small">
                    <Select id="active-theme" labelId="active-theme-label" value={draft.manualTheme} className={fieldClass}
                      onChange={(event) => setDraft({ ...draft, manualTheme: event.target.value as SeasonalSettings["manualTheme"] })}>
                      <MenuItem value="default">Default storefront</MenuItem>
                      {THEMES.map(({ id, label }) => <MenuItem key={id} value={id}>{label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </div>}
              </div>
              <Typography color="grey.600" className="mt-4 text-sm font-inter">
                {draft.mode === "manual"
                  ? "Only enabled campaigns can go live. Choose Default storefront to turn seasonal views off."
                  : "Enabled campaigns run between their start and end times. Their schedules cannot overlap."}
              </Typography>
            </section>
          )}

          <section className="rounded-xl border border-[#EAECF0] bg-white p-5 md:p-6">
            <Tabs value={theme} onChange={(_event, value: SeasonalTheme) => { setTheme(value); setProductSearch(""); }}
              variant="scrollable" scrollButtons="auto" aria-label="Seasonal campaign"
              className="border-b border-[#EAECF0]">
              {THEMES.map(({ id, label }) => <Tab className="capitalize font-inter" key={id} value={id} label={label} />)}
            </Tabs>
            <div className="mt-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {isDeveloper ? (
                  <FormControlLabel control={<Switch checked={campaign.enabled}
                    onChange={(event) => updateCampaign({ enabled: event.target.checked })} />}
                    label={`Enable ${THEMES.find((item) => item.id === theme)?.label} campaign`} />
                ) : (
                  <Typography color="grey.700" className={labelClass}>
                    {campaign.enabled ? "Campaign enabled" : "Campaign disabled"}
                  </Typography>
                )}
                <Chip size="small" label={campaign.productIds.length
                  ? `${campaign.productIds.length} product${campaign.productIds.length === 1 ? "" : "s"} selected` : "Random 12 products"} />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Typography component="label" htmlFor="seasonal-title" color="grey.700" className={labelClass}>Deals section title</Typography>
                  <TextField id="seasonal-title" size="small" className={fieldClass} fullWidth required
                    placeholder="Enter the deals title" inputProps={{ maxLength: 80 }} value={campaign.title}
                    onChange={(event) => updateCampaign({ title: event.target.value })} />
                </div>
                <div className="space-y-2">
                  <Typography component="label" htmlFor="seasonal-headline" color="grey.700" className={labelClass}>Hero headline</Typography>
                  <TextField id="seasonal-headline" size="small" className={fieldClass} fullWidth required
                    placeholder="Enter the hero headline" inputProps={{ maxLength: 120 }} value={campaign.headline}
                    onChange={(event) => updateCampaign({ headline: event.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Typography component="label" htmlFor="seasonal-description" color="grey.700" className={labelClass}>Hero description</Typography>
                  <TextField id="seasonal-description" size="small" className={fieldClass} fullWidth required
                    multiline minRows={3} placeholder="Describe the campaign" inputProps={{ maxLength: 240 }}
                    value={campaign.description} onChange={(event) => updateCampaign({ description: event.target.value })} />
                </div>
                {theme !== "easter" && <>
                <div className="space-y-2 md:col-span-2">
                  <Typography component="label" htmlFor="seasonal-announcement" color="grey.700" className={labelClass}>Announcement bar text</Typography>
                  <TextField id="seasonal-announcement" size="small" className={fieldClass} fullWidth required
                    inputProps={{ maxLength: 160 }} value={campaign.announcementText}
                    onChange={(event) => updateCampaign({ announcementText: event.target.value })} />
                </div>
                <div className="space-y-2">
                  <Typography component="label" htmlFor="seasonal-announcement-href" color="grey.700" className={labelClass}>Announcement destination</Typography>
                  <TextField id="seasonal-announcement-href" size="small" className={fieldClass} fullWidth required
                    placeholder="/products" helperText="Use a path on this website, beginning with /." inputProps={{ maxLength: 240 }}
                    value={campaign.announcementHref} onChange={(event) => updateCampaign({ announcementHref: event.target.value })} />
                </div>
                <div className="space-y-2">
                  <Typography component="label" htmlFor="seasonal-cta-label" color="grey.700" className={labelClass}>Hero button text</Typography>
                  <TextField id="seasonal-cta-label" size="small" className={fieldClass} fullWidth required
                    inputProps={{ maxLength: 40 }} value={campaign.ctaLabel}
                    onChange={(event) => updateCampaign({ ctaLabel: event.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Typography component="label" htmlFor="seasonal-cta-href" color="grey.700" className={labelClass}>Hero button destination</Typography>
                  <TextField id="seasonal-cta-href" size="small" className={fieldClass} fullWidth required
                    placeholder="/products" helperText="Use a path on this website, beginning with /." inputProps={{ maxLength: 240 }}
                    value={campaign.ctaHref} onChange={(event) => updateCampaign({ ctaHref: event.target.value })} />
                </div>
                </>}
                <div className="space-y-2">
                  <Typography component="label" htmlFor="seasonal-start" color="grey.700" className={labelClass}>Starts</Typography>
                  <TextField id="seasonal-start" type="datetime-local" size="small" className={fieldClass} fullWidth
                    value={toLocalInput(campaign.startsAt)} onChange={(event) => updateCampaign({ startsAt: toUtc(event.target.value) })}
                    required={draft.mode === "scheduled" && campaign.enabled} />
                </div>
                <div className="space-y-2">
                  <Typography component="label" htmlFor="seasonal-end" color="grey.700" className={labelClass}>Ends</Typography>
                  <TextField id="seasonal-end" type="datetime-local" size="small" className={fieldClass} fullWidth
                    value={toLocalInput(campaign.endsAt)} onChange={(event) => updateCampaign({ endsAt: toUtc(event.target.value) })}
                    required={draft.mode === "scheduled" && campaign.enabled} />
                </div>
              </div>
              <Typography color="grey.600" className="text-sm font-inter">
                Dates use your device time zone and are saved as UTC. The end time is exclusive.
              </Typography>
              <div className="space-y-2">
                <Typography component="label" htmlFor="campaign-products" color="grey.700" className={labelClass}>Campaign products (optional)</Typography>
                <Autocomplete multiple filterSelectedOptions options={productOptions} value={selectedProducts} inputValue={productSearch}
                  getOptionDisabled={(option) => campaign.productIds.length >= 24 && !campaign.productIds.includes(option.id)}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => `${option.name}${option.modelNumber ? ` (${option.modelNumber})` : ""}`}
                  onInputChange={(_event, value, reason) => {
                    if (reason === "input" || reason === "clear") setProductSearch(value);
                  }}
                  onChange={(_event, value) => updateCampaign({ productIds: value.map((product) => product.id) })}
                  renderInput={(params) => <TextField {...params} id="campaign-products" size="small" className={fieldClass}
                    placeholder="Search products" helperText="Choose up to 24 products. Leave empty to show 12 random products."
                    InputProps={{ ...params.InputProps, endAdornment: <>{isSearching && <CircularProgress size={18} />}{params.InputProps.endAdornment}</> }} />}
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
