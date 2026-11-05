import { useEffect, useMemo, useState } from "react";
import {
  Alert, Autocomplete, Box, Button, Card, CardContent, Chip, CircularProgress,
  FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, Switch,
  Tab, Tabs, TextField, Typography,
} from "@mui/material";
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

const toLocalInput = (date: string | null) => {
  if (!date) return "";
  const value = new Date(date);
  return new Date(value.getTime() - value.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};
const toUtc = (value: string) => value ? new Date(value).toISOString() : null;

export default function SeasonalSettingsPage() {
  const { data, isLoading, error: loadError } = useGetSeasonalSettingsQuery();
  const [saveSettings, { isLoading: isSaving }] = useSaveSeasonalSettingsMutation();
  const [draft, setDraft] = useState<SeasonalSettings | null>(null);
  const [theme, setTheme] = useState<SeasonalTheme>("christmas");
  const [productSearch, setProductSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [saveError, setSaveError] = useState("");

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
    setNotice("");
    setSaveError("");
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaveError("");
    setNotice("");
    try {
      const saved = await saveSettings(draft).unwrap();
      setDraft(structuredClone(saved.data));
      setNotice("Seasonal settings saved. The storefronts will refresh shortly.");
    } catch (error) {
      const response = error as { data?: { error?: string }; defaultUserMessage?: string };
      setSaveError(response.data?.error ?? response.defaultUserMessage ?? "Could not save seasonal settings.");
    }
  };

  if (isLoading) return <Box p={4}><CircularProgress aria-label="Loading seasonal settings" /></Box>;
  if (loadError || !draft) return <Box p={4}><Alert severity="error">Could not load seasonal settings. Refresh the page to retry.</Alert></Box>;

  const campaign = draft.campaigns[theme];
  const optionById = new Map(productOptions.map((product) => [product.id, product]));
  const selectedProducts = campaign.productIds.map((id) => optionById.get(id) ?? { id, name: id, modelNumber: "" });

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Seasonal storefront</Typography>
          <Typography color="text.secondary">Choose the campaign customers see on the website and mobile app.</Typography>
        </Box>
        {notice && <Alert severity="success">{notice}</Alert>}
        {saveError && <Alert severity="error">{saveError}</Alert>}

        <Card variant="outlined"><CardContent>
          <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
            <FormControl fullWidth>
              <InputLabel id="seasonal-mode-label">Activation mode</InputLabel>
              <Select labelId="seasonal-mode-label" label="Activation mode" value={draft.mode}
                onChange={(event) => setDraft({ ...draft, mode: event.target.value as SeasonalSettings["mode"] })}>
                <MenuItem value="manual">Manual</MenuItem>
                <MenuItem value="scheduled">Scheduled (UTC instants)</MenuItem>
              </Select>
            </FormControl>
            {draft.mode === "manual" && <FormControl fullWidth>
              <InputLabel id="active-theme-label">Active theme</InputLabel>
              <Select labelId="active-theme-label" label="Active theme" value={draft.manualTheme}
                onChange={(event) => setDraft({ ...draft, manualTheme: event.target.value as SeasonalSettings["manualTheme"] })}>
                <MenuItem value="default">Default storefront</MenuItem>
                {THEMES.map(({ id, label }) => <MenuItem key={id} value={id}>{label}</MenuItem>)}
              </Select>
            </FormControl>}
          </Stack>
          <Typography variant="body2" color="text.secondary" mt={2}>
            {draft.mode === "manual"
              ? "Only an enabled theme can go live. Select Default storefront to turn seasonal views off."
              : "Enabled campaigns activate at their start time and end at their end time. Schedules cannot overlap."}
          </Typography>
        </CardContent></Card>

        <Card variant="outlined"><CardContent>
          <Tabs value={theme} onChange={(_event, value: SeasonalTheme) => { setTheme(value); setProductSearch(""); }}
            variant="scrollable" scrollButtons="auto" aria-label="Seasonal campaign">
            {THEMES.map(({ id, label }) => <Tab key={id} value={id} label={label} />)}
          </Tabs>
          <Stack spacing={3} mt={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <FormControlLabel control={<Switch checked={campaign.enabled}
                onChange={(event) => updateCampaign({ enabled: event.target.checked })} />}
                label={`Enable ${THEMES.find((item) => item.id === theme)?.label} campaign`} />
              <Chip label={campaign.productIds.length + " products selected"} />
            </Stack>
            <TextField label="Deals section title" value={campaign.title} inputProps={{ maxLength: 80 }}
              onChange={(event) => updateCampaign({ title: event.target.value })} fullWidth required />
            <TextField label="Hero headline" value={campaign.headline} inputProps={{ maxLength: 120 }}
              onChange={(event) => updateCampaign({ headline: event.target.value })} fullWidth required />
            <TextField label="Hero description" value={campaign.description} inputProps={{ maxLength: 240 }}
              onChange={(event) => updateCampaign({ description: event.target.value })} fullWidth multiline minRows={2} required />
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField type="datetime-local" label="Starts" InputLabelProps={{ shrink: true }}
                value={toLocalInput(campaign.startsAt)} onChange={(event) => updateCampaign({ startsAt: toUtc(event.target.value) })}
                fullWidth required={draft.mode === "scheduled" && campaign.enabled} />
              <TextField type="datetime-local" label="Ends" InputLabelProps={{ shrink: true }}
                value={toLocalInput(campaign.endsAt)} onChange={(event) => updateCampaign({ endsAt: toUtc(event.target.value) })}
                fullWidth required={draft.mode === "scheduled" && campaign.enabled} />
            </Stack>
            <Typography variant="body2" color="text.secondary">Times use your device time zone and are saved as UTC. The end time is exclusive.</Typography>
            <Autocomplete multiple filterSelectedOptions options={productOptions} value={selectedProducts} inputValue={productSearch}
              getOptionDisabled={(option) => campaign.productIds.length >= 24 && !campaign.productIds.includes(option.id)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) => `${option.name}${option.modelNumber ? ` (${option.modelNumber})` : ""}`}
              onInputChange={(_event, value, reason) => {
                if (reason === "input" || reason === "clear") setProductSearch(value);
              }}
              onChange={(_event, value) => updateCampaign({ productIds: value.map((product) => product.id) })}
              renderInput={(params) => <TextField {...params} label="Campaign products" placeholder="Search products" helperText="Select up to 24 active products. Only these appear in the deals section." InputProps={{ ...params.InputProps, endAdornment: <>{isSearching && <CircularProgress size={18} />}{params.InputProps.endAdornment}</> }} />}
            />
          </Stack>
        </CardContent></Card>
        <Stack direction="row" justifyContent="flex-end">
          <Button variant="contained" size="large" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving…" : "Save seasonal settings"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
