export const REGION_CHOICES = [
  { value: "East Asia", label: "East Asia" },
  { value: "Southeast Asia", label: "Southeast Asia" },
  { value: "South Asia", label: "South Asia" },
  { value: "Central / West Asia", label: "Central / West Asia" },
  { value: "North America", label: "North America" },
  { value: "Europe", label: "Europe" },
  { value: "Oceania", label: "Oceania" },
  { value: "Latin America", label: "Latin America" },
  { value: "Middle East / Africa", label: "Middle East / Africa" },
] as const;

export type Region = (typeof REGION_CHOICES)[number]["value"];

export const REGION_COOKIE_KEY = "yomu_region";
export const REGION_STORAGE_KEY = "yomu_region";

export function normalizeRegion(value: string | null | undefined): Region {
  const raw = (value ?? "").trim();
  const found = REGION_CHOICES.find((r) => r.value === raw);
  return (found?.value ?? "East Asia") as Region;
}

